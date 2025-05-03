const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const ErrorHandler = require("../utils/errorHandler");

exports.registerUser = catchAsyncErrors(async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "sample id",
            url: "sample url",
        },
    });

    sendToken(user, 201, res);
});

exports.loginUser = catchAsyncErrors(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
});

exports.logout = catchAsyncErrors(async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

exports.forgotPassword = catchAsyncErrors(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetPasswordURL = `http://${req.protocol}/api/v1/password/reset/` + user.resetPasswordToken;
    const message = `Your password reset token is: \n\n ${resetPasswordURL} \n\n If you have not requested this email, then ignore it. `;
    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce password recovery`,
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    }
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));

    }
})

const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex')

    const user = await user.find({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Passwords do not match', 400))
    }
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    sendToken(user, 200, res)
    
})