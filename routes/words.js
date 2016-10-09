/**
 * Created by jaewon-choi on 09/10/2016.
 */
var express = require('express');
var router = express.Router();
var url = require('url');

router.get('/', function(req, res, next){
	res.send({"words" : ['친구', '활달', '무슨', '부모님', '별로',
		'변화', '방법', '발랄', '민감', '무리', '마음속', '목소리',
		'명정', '명수', '명랑', '명과', '머리', '매우', '부분', '분반',
		'힘', '친구', '공유', '타인', '기억', '죄인', '마음속', '자신감',
		'상처', '방법', '골목대장', '화장실', '은따', '왕따', '학교', '생활',
		'목소리', '혼자', '걱정', '부모님']});
});

module.exports = router;