meta = {
    "index": "/person/conditions/heigh"
    "enName": "blood press",
    "cnName": "血压",
    "unit": "String",
    "dayOfValidity": 10,
    "lowerLimit": 1,
    "upperLimit": 1000,
    "ranges": [{
        "ageBeg": 12.1,
        "ageEnd": 30,
        "sexType": "M/F/All",
        "minHealthy": {
            "threhost": 10.0,
            "diseases": ["ICD-10", "ICD_10"]
                //症状是否加入
        },
        "maxHealthy": {
            "threhost": 100.0,
            "diseases": ["ICD-10", "ICD_10"]
                //症状是否加入
        },
        "minDanger": {
            "threhost": 5.0,
            "diseases": ["ICD-10", "ICD_10"]
                //症状是否加入
        },
        "maxDanger": {
            "threhost": 300.0,
            "diseases": ["ICD-10", "ICD_10"]
                //症状是否加入
        }

    }]

}
