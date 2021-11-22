const express = require('express');
const cors = require("cors")
const {MailService} = require("./MailService");
require('dotenv').config();
const router = express.Router();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.urlencoded({extended: true}));

let maxCountRequestsPerTime = 2;
let time = 12000;
let requestContainer = {};

(async function () {
    try {
        app.listen(PORT, () => console.log(`Server is started on PORT ${PORT}`));
        app.use('/api', router);
    } catch (err) {
        console.log("Server error " + err.message);
        process.exit(1);
    }
})();

router.post('/send-mail',
    async (req, res) => {
        try {
            const {firstName, lastName, subject, message} = req.body;
            if (!requestContainer[req.originalUrl]) {
                requestContainer[req.originalUrl] = {
                    count: 1,
                    timer: setTimeout(() => {
                        requestContainer[req.originalUrl].count = 0;
                        clearInterval(this.timer)
                        requestContainer[req.originalUrl].timer = null;
                    }, time)
                }
            }
            else{
                if (requestContainer[req.originalUrl].count + 1 > maxCountRequestsPerTime){
                    res.status(429).json({message: "Too many requests!!!"});
                    return;
                }
                requestContainer[req.originalUrl].count++;
                if (!requestContainer[req.originalUrl].timer){
                    requestContainer[req.originalUrl].timer = setTimeout(() => {
                        requestContainer[req.originalUrl].count = 0;
                        clearInterval(requestContainer[req.originalUrl].timer)
                        requestContainer[req.originalUrl].timer = null;
                    }, time);
                }
                requestContainer[req.originalUrl].timer = setTimeout(() => requestContainer[req.originalUrl].count, time / requestContainer[req.originalUrl].count);
            }
            const mailService = new MailService(subject, message);
            const response = await mailService.sendMail();
            if (response.status === "OK") {
                res.status(200).json({message: response.message});
            } else {
                res.status(400).json({message: response.message});
            }
        } catch (err) {
            res.status(500).json({message: "Something is wrong, please try again"});
            console.log('Server was crashed:', err.message);
        }
    });

