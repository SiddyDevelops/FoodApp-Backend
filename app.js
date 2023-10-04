// Access Pass: SlvtSdrlwRorUIiW    
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());
app.listen(3000);

const userRouter = require('./routers/userRouter');
const authRouter = require('./routers/authRouter');
const planRouter = require('./routers/planRouter');
const reviewRouter = require('./routers/reviewRouter');
const bookingRouter = require('./routers/bookingRouter');

app.use('/user',userRouter);
app.use('/auth',authRouter);
app.use('/plans',planRouter);
app.use('/review',reviewRouter);
app.use('/booking',bookingRouter);