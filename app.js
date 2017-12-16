const exp = require('express');
const app = exp();

const mysql = require('mysql');
var dbconf = {
    host: 'localhost',
    user: 'root',
    password: 'db@root#2017',
    port: '3306',
    database: 'angular2'
};
var connection = mysql.createConnection(dbconf);
app.use('/', (req, res, next) => {
    console.log(req.url);
    if (req.url.indexOf('.html') != -1) {
        res.sendFile(req.url, {root: __dirname + '/views'});
    } else {
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        next();
    }
});
app.get('/', (req, res, next) => {
    res.write('<br>니가 요청한 경로 : ' + req.url);
    res.write('<br>시작합니다.');
    res.write('<br>우리사랑하지 말아요.');
    res.write('<br>너무 멀잖아요.');
    next();
});
app.get('/', (req, res, next)=>{
    res.write('<br>난 두번째!');
    res.end();
});
app.get('/test', (req, res, next)=>{
    res.write('<br>니가 요청한 경로 : ' + req.url);
    res.end();
});
app.get('/join2', (req, res, next)=>{
    var username = req.query.username;
    var userage = req.query.userage;
    var userid = req.query.userid;
    var userpwd = req.query.userpwd;
    var useraddress = req.query.useraddress;

    if (username.trim() == '') {
        res.write('<script>alert("이름 없니?");location.href="/join";</script>');
    }

    if (userage.trim() == '') {
        res.write('<script>alert("이름 없니?");location.href="/join";</script>');
    }

    var sql = 'SELECT userid FROM user_info WHERE userid=?';
    var values = [userid];
    connection.query(sql, values, (err, rows)=>{
        if (err) throw err;
        if (rows.length === 0) {
            sql = 'INSERT user_info (username, userage, userid, userpwd, useraddress, dino)';
            sql += ' VALUES (?, ?, ?, ?, ?, 1);';
        
            values = [username, userage, userid, userpwd, useraddress];
            connection.query(sql, values, (err, rows)=>{
                if (err) {
                    console.log(err);
                    res.write('회원가입이 실패하였습니다.');
                    res.end();
                } else
                if (rows) {
                    if (rows.affectedRows == 1) {
                        res.write('회원가입 완료~~');
                        res.end();
                    }
                }
            });
        } else {
            res.write('입력하신 아이디 : ' + userid + '가 이미 존재합니다.');
            res.end();
        }
    });

});
app.get('/join', (req, res, next)=>{
    
    var html = '<form method="get" action="/join2">';
    html += ('<table border="1">');
    html += ('<tr><td colspan="2" align="center">회원가입</td></tr>')
    html += ('<tr>');
    html += ('<td>이름</td>');
    html += ('<td><input type="text" name="username" id="name"></td>');
    html += ('</tr>');
    html += ('<tr>');
    html += ('<td>나이</td>');
    html += ('<td><input type="text" name="userage" id="userage"></td>');
    html += ('</tr>');
    html += ('<tr>');
    html += ('<td>아이디</td>');
    html += ('<td><input type="text" name="userid" id="userid"></td>');
    html += ('</tr>');
    html += ('<tr>');
    html += ('<td>비밀번호</td>');
    html += ('<td><input type="password" name="userpwd" id="userpwd"></td>');
    html += ('</tr>');
    html += ('<tr>');
    html += ('<td>주소</td>');
    html += ('<td><input type="text" name="useraddress" id="useraddress"></td>');
    html += ('</tr>');
    html += ('<tr><td colspan="2" align="center"><button type="submit">회원가입</button></td></tr>')
    html += ('</table>');
    html += '</form>';
    res.write(html);
    res.end();
});
app.get('/list', (req, res, next)=>{
    var sql = 'SELECT * FROM user_info';
    var values = [];
    var result = {};
    connection.query(sql, values, (err, rows)=>{
        if (err) throw err;
        result['list'] = rows;
        res.json(result);
    });
});
app.listen(3000, function () {
    console.log('오 서버가 3000으로 시작이 잘되어요.');
})