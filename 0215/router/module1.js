module.exports = (app,fs) => {

    // http://localhost:3000  
    app.get('/',(req,res) => {
        res.render('index.ejs',{length:10});
    })

    //http://localhost:3000/about
    app.get('/about',(req,res)=>{
        res.render('about.html');
    });

    //http://localhost:3001/list
    app.get('/list',(req,res)=>{
        fs.readFile(__dirname+'/../data/member.json','utf8',(err,data) =>{
            if(!err){
                console.log(data);
                res.writeHead(200,{'content-type':'text/json:charset=utf8'})
                res.end(data);
            } else{ 
                console.log(err);
            }
        });
    });
    
    //http://localhost:3000/getMember/apple
    app.get('/getMember/:userid',(req,res)=>{
        fs.readFile(__dirname+ '/../data/member.json','utf-8',(err,data) =>{
            if(!err){
                const member = JSON.parse(data); // JSON형식으로 불러옴
                console.log(member);
                res.json(member[req.params.userid])
            } else {
                console.log(err)
    
            }
        });
    });

    //http://localhost:3000/joinMember/apple 추가
    app.post('/joinMember/:userid',(req,res)=>{
        const result = {}; // 실제 데이터 입력 요소
        const userid = req.params.userid;
        if(!req.body['password']|| !req.body['name']){ //내용입력여부
            result["success"] = 100;
            result["msg"] = "매개변수가 전달되지 않음";
            res.json(result);
            return false; // 더이상 진행되지 않되게 불러왔던 곳으로 이동
        }
       //아이디 중복검사 
       fs.readFile(__dirname + "/../data/member.json","utf8", (err,data) =>{
        const member = JSON.parse(data);
        if(member[userid]){ //입력한 userid를 json에 있는지 확인
            result["success"] = 101; // 101을 중복 코드로 이용
            result["msg"] = "중복된 아이디";
            res.json(result);
            return false;
        }
        console.log(req.body);// 확인
         
        member[userid] = req.body; // 아이디, 패스워드 
        fs.writeFile(__dirname + "/../data/member.json",JSON.stringify(member,null,'\t'),
        'utf8',(err,data) =>{
            if(!err){
                result["success"] = 200;
                result["msg"] = "성공";
                res.json(result);
            } else {
                console.log(err);
            }
        });

       });
            
    });

    // 회원수정 
    // http://localhost:3001/updateMember/apple1
    app.put('/updateMember/:userid',(req,res) =>{
        const result = {};
        const userid = req.params.userid;

        if(!req.body['password']|| !req.body['name']){ //내용입력여부
            result["success"] = 100;
            result["msg"] = "매개변수가 전달되지 않음";
            res.json(result);
            return false; // 더이상 진행되지 않되게 불러왔던 곳으로 이동
        }

        fs.readFile(__dirname + '/../data/member.json','utf-8',(err,data)=>{
            if(!err){
                const member = JSON.parse(data); // JSON파일로 저장
                member[userid] = req.body // 전달한 정보

                // 수정한 파일을 작성
                fs.writeFile(__dirname + '/../data/member.json',JSON.stringify(member,null,'\t'),(err,data) =>{
                    if(!err){
                        result['success'] = 200;
                        result['msg'] = "성공";
                        res.json(result);
                    } else{
                        console.log(err);
                    }
                });
            } else{
                console.log(err);
                result['success'] = 200;
                result['msg'] = "성공";
                res.json(result);
            }
        })
    })

    // 회원정보 삭제
    //http://localhost:3000/deleteMember/berry
    app.delete('/deleteMember/:userid',(req,res) =>{
        let result = {};
        fs.readFile(__dirname + '/../data/member.json','utf-8',(err,data)=>{
            const member = JSON.parse(data);
            if(!member[req.params.userid]){
                result["success"] = 102;
                result["msg"] = "사용자를 찾을수 없음";
                res.json(result);
                return false;
            }

            // 입력한 아이디가 있다면
            delete member[req.params.userid]; // 데이터 삭제
            fs.writeFile(__dirname + "/../data/member.json",JSON.stringify(member, null, '\t'),(err,data) =>{
                result["success"] = 200;
                result["msg"] = "성공";
                res.json(result);
            }) 
        });
    })
}
