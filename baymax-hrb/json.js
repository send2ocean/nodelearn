person = {
    "userId": "101",
    "name": "Jhon",
    "avatar": "/avatars/101.jpg",
    "staticProfile": {
        "birthDate": "1941-09-06",
        "isPremature": true,
        "sex": "Male",
        "bloodType": "AB"
    },
    "history": [{
        "ICD_10": "1",
        "cured": true,
        "since": "2015-06-08 23:53:17",
        "curedAt": "2016-06-08 23:53:17"
    }, {
        "ICD_10": "2",
        "cured": true,
        "since": "2015-06-08 23:53:17",
        "curedAt": "2016-06-08 23:53:17"
    }],
    "procedures": [{
        "ICD_9_CM3": "1",
        "performancedAt": "2016-06-08 23:53:17"
    }],
    "allergies": [{
        "allergyName": "过敏药物有效成分名称（如磺胺类）或者食物的名称，中英文待定"　
    }],
    "symptoms": [{
        "name": "头疼",
        "beganAt": "2016-05-06 13:34:00",
        "endedAt": "2016-05-06 18:34:00"
    }],
    "familyHistory": ["ICD-10", "ICD-10"],
    "treatments": [{ //剂量和服用周期处理待定
        "type": "药物／放疗／化疗／物理",
        "drugID": "药物编号",
        "beganAt": "2016-05-06 13:34:00",
        "endedAt": "2016-05-06 18:34:00"
    }],
    //婚育 冶游
    "labResults": [{
        "test": "血常规",
        "labItem": "中英文混合String",
        "method": "中英文混合String",
        "value": "20或中文", //百分数转换成小数
        "testedAt": "2018-10-12T12:22:34Z"
    }],
    "images": [{
        "type": "CT",
        "bodyPart":"全身／头部",
        "fileName": "/user/file/001.img",
        "takenAt": "2018-10-12T12:22:34Z",
        "conclusion": "结论"
    }],
    "otherFiles": [{
        "type": "CT",
        "fileName": "/user/file/001.img",
        "takenAt": "2018-10-12T12:22:34Z",
        "comment": "备注信息"
    }],
    "conditions": {
        "heigh": {
            "value": 120,
            "recordedAt": "2018-10-12T12:22:34Z"
        },
        "glucose": {
            "value": 7.2,
            "when": "after-meal",
            "recordedAt": "2018-10-12T12:22:34Z"
        },
        "isSmoker":{
            "value":0,
            "recordedAt": "2018-10-12T12:22:34Z"
        },
        "isSmoker2":{
            "value":0.33,
            "recordedAt": "2018-10-12T12:22:34Z"
        }

    }
}
