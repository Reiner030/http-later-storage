var createStorage = require(".."),
    expect = require("expect.js"),
    sinon = require("sinon");

describe("createStorage(function, function, function)", function() {
    it("should implement Storage interface", function(done) {
        var data = {"foo": 42},
            queue = sinon.spy(function(task, done) {
                expect(task).to.be(data);
                expect(task.foo).to.be(42);
                done(null, task.foo);
            }),
            unqueue = sinon.spy(function(done) {
                expect(this.bar).to.be(23);
                done(null, {bar: this.bar}, this.bar);
            }),
            log = sinon.spy(function(key, result, done) {
                expect(key).to.be(23);
                expect(result).to.be("23");
                done();
            }),
            Storage = createStorage(queue, unqueue, log),
            storage;

        expect(Storage).to.be.a("function");
        storage = new Storage({"bar": 23});

        expect(storage.queue).to.be.a("function");
        storage.queue(data, function(err, key) {
            expect(queue.calledOnce).to.be(true);
            expect(Boolean(err)).to.be(false);
            expect(key).to.be(42);

            storage.unqueue(function(err, task, key) {
                expect(unqueue.calledOnce).to.be(true);
                expect(Boolean(err)).to.be(false);
                expect(task).to.be.an("object");
                expect(task.bar).to.be(23);
                expect(key).to.be(23);

                storage.log(key, String(task.bar), function(err) {
                    expect(Boolean(err)).to.be(false);
                    done();
                });
            });
        });
    });
});
