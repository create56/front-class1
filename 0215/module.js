const express=require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.engine('html', require('ejs').renderFile);
//views엔진등록
//ejs파일이 자동으로 html변환,  views폴더 생성이 공식
app.use(bodyParser.urlencoded({extended: false}))

//사용자정의 모듈 선언
const module1 = require('./router/module1')(app,fs);//express()와 fs()를 전달

app.listen( port, () => {
    console.log(`${port}번 포트로 서버 실행중...`);
})
