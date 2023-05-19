const sendToken = (user, status, res) => {
  const token = user.getJwtToken();

  res.status(status).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
