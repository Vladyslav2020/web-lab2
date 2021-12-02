const http = require('http');
const { MailService } = require('./mail/MailService');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const maxCountRequestsPerTime = 2;
const time = 12000;
const requestContainer = {};
let timer;

const returnResponse = (res, status, obj) => {
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'origin, content-type, accept',
    });
    res.end(JSON.stringify(obj));
};

const handleRequest = async (req, res, body) => {
    try {
        const { firstName, lastName, subject, message } = JSON.parse(body);
        const ip =
            req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
        if (!timer) {
            timer = setTimeout(() => {
                Object.values(requestContainer).forEach(
                    item => (item.count = 0),
                );
                clearInterval(timer);
            }, time);
        }
        if (!requestContainer[ip]) {
            requestContainer[ip] = {
                count: 1,
            };
        } else {
            requestContainer[ip].count++;
        }
        if (requestContainer[ip].count > maxCountRequestsPerTime) {
            returnResponse(res, 429, { message: 'Too many requests!!!' });
            return;
        }
        const mailService = new MailService(
            subject,
            message,
            firstName,
            lastName,
        );
        const response = await mailService.sendMail();
        if (response.status === 'OK') {
            returnResponse(res, 200, { message: response.message });
        } else {
            returnResponse(res, 400, { message: response.message });
        }
    } catch (err) {
        returnResponse(res, 500, {
            message: 'Something is wrong, please try again',
        });
        console.log('Server was crashed:', err.message);
    }
};

const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        if (req.url === '/api/send-mail' && req.method === 'POST') {
            handleRequest(req, res, body);
        } else {
            res.statusCode = 400;
            res.end();
        }
    });
    if (req.method === 'OPTIONS') {
        req.statusCode = 200;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'origin, content-type, accept',
        );
        res.end();
    }
});

server.listen(PORT, () => {
    console.log(`Server is started on PORT ${PORT}`);
});
