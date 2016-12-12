var redis = require("redis"),
    client = redis.createClient();

// if you'd like to select database 3, instead of 0 (default), call
client.select(3, function() {
    console.log("select3")
 });

client.on("error", function (err) {
    console.log("Error " + err);
});
client.on("connect", function () {
    console.log("connected "  );
});
client.on("end", function () {
    console.log("connect end "  );
});
client.set("demo", "demo val", redis.print);
client.hset("myhash", "hashtest 1", "some value", redis.print);
client.hset(["myhash", "hashtest 2", "some other value"], redis.print);
client.hkeys("myhash", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});
