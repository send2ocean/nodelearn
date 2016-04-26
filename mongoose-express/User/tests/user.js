'use strict';

var expect   = require('chai').expect,
    mongoose = require('mongoose'),
    userDef  = require('../model'),
    User;


describe('<Unit Test>', function () {

    before(function (done) {
        if (mongoose.connection.db) {
            User = mongoose.model('User');
            return done();
        }
        userDef({}, mongoose, mongoose.Schema, require('lodash'), require('async'), function () {});
        User = mongoose.model('User');
        mongoose.connect('mongodb://localhost:27017/healthlink', {
            server: {poolSize: 5}
        }, done);
    });

    describe('Model User: Patient', function () {
        var patient;

        beforeEach(function (done) {
            patient = {
                sex: 'male',
                birthDate: '1969-09-12',
                cellPhone: '11111111111',
                address: 'none',
                city: 'Beijing',
                password: 'password',
                role: 'patient'
            };
            done();
        });

        describe('Method Save', function () {
            it('should begin without the test patient', function (done) {
                User.find({
                    cellPhone: patient.cellPhone
                }, function (err, patients) {
                    expect(patients.length).to.equal(0);
                    done();
                });
            });

            it('should be able to save without problems', function (done) {

                var _user = new User(patient);
                _user.save(function (err) {
                    expect(err).to.be.null;
                    _user.remove(function () {
                        done();
                    });
                });

            });

            it('should check that patient role are assigned and created properly', function (done) {

                var _user = new User(patient);
                _user.save(function (err) {
                    expect(err).to.be.null;

                    expect(_user.isPatient()).to.equal(true);
                    _user.remove(function () {
                        done();
                    });
                });

            });

            it('should confirm that password is hashed correctly', function (done) {

                var _user = new User(patient);

                _user.save(function (err) {
                    expect(err).to.be.null;

                    expect(_user.hashed_password.length).to.not.equal(0);
                    expect(_user.salt.length).to.not.equal(0);
                    expect(_user.authenticate(patient.password)).to.equal(true);
                    _user.remove(function () {
                        done();
                    });

                });
            });

            it('should be able to create user and save user for updates without problems', function (done) {

                var _user = new User(patient);
                _user.save(function (err) {
                    expect(err).to.be.null;

                    _user.city = 'Xiamen';
                    _user.save(function (err) {
                        expect(err).to.be.null;
                        expect(_user.city).to.equal('Xiamen');
                        _user.remove(function () {
                            done();
                        });
                    });

                });

            });

            it('should fail to save an existing user with the same values', function (done) {

                var _user1 = new User(patient);
                var _user2 = new User(patient);

                _user1.save(function (err) {
                    expect(err).to.be.null;
                    _user2.save(function (err) {
                        expect(err).to.not.be.null;
                        _user1.remove(function () {
                            if (!err) {
                                _user2.remove(function () {
                                    done();
                                });
                            }
                            done();
                        });

                    });
                });
            });

            it('should show an error when try to save without cellPhone', function (done) {

                var _user = new User(patient);
                _user.cellPhone = '';

                return _user.save(function (err) {
                    expect(err).to.not.be.null;
                    done();
                });
            });

            it('should show an error when try to save without address', function (done) {

                var _user = new User(patient);
                _user.address = '';

                return _user.save(function (err) {
                    expect(err).to.not.be.null;
                    done();
                });
            });

            it('should show an error when try to save without password and provider set to local', function (done) {

                var _user = new User(patient);
                _user.password = '';
                _user.provider = 'local';

                return _user.save(function (err) {
                    expect(err).to.not.be.null;
                    done();
                });
            });

            it('should show an error when try to save without sex', function (done) {

                var _user = new User(patient);
                _user.sex = '';

                return _user.save(function (err) {
                    expect(err).to.not.be.null;
                    done();
                });
            });

            it('should show an error when try to save without birthDate', function (done) {

                var _user = new User(patient);
                _user.birthDate = '';

                return _user.save(function (err) {
                    expect(err).to.not.be.null;
                    done();
                });
            });

        });
    });

    describe('Model User: Doctor', function () {
        var doctor;
        beforeEach(function (done) {
            doctor = {
                fullName: '华佗',
                sex: 'male',
                cellPhone: '22222222222',
                avatarImage: 'http://mjz.joyme.com/images/mjz/b/b2/%E5%BA%95%E5%9B%BE.png',
                jobTitle: '内科主任医师',
                license: 'MI6-110',
                hospitalName: '1st Hospital',
                hospitalCity: 'Shu',
                address: 'none',
                city: 'Shanghai',
                department: 'Endocrine Branch',
                password: 'password',
                role: 'doctor'
            };
            done();
        });

        describe('Method Save', function () {
            it('should begin without the test doctor', function (done) {
                User.find({
                    cellPhone: doctor.cellPhone
                }, function (err, doctors) {
                    expect(err).to.be.null;
                    expect(doctors.length).to.equal(0);
                    done();
                });
            });

            it('should be able to save without problems', function (done) {

                var _user = new User(doctor);
                _user.save(function (err) {
                    expect(err).to.be.null;
                    _user.remove(function () {
                        done();
                    });
                });

            });

            it('should check that doctor role are assigned and created properly', function (done) {

                var _user = new User(doctor);
                _user.save(function (err) {
                    expect(err).to.be.null;
                    expect(_user.isDoctor()).to.equal(true);
                    expect(_user.IDinEight.length).to.not.equal(0);
                    _user.remove(function () {
                        done();
                    });
                });

            });

            it('should confirm that password is hashed correctly', function (done) {

                var _user = new User(doctor);

                _user.save(function (err) {
                    expect(err).to.be.null;

                    expect(_user.hashed_password.length).to.not.equal(0);
                    expect(_user.salt.length).to.not.equal(0);
                    expect(_user.authenticate(doctor.password)).to.equal(true);
                    _user.remove(function () {
                        done();
                    });

                });
            });

            it('should be able to create user and save user for updates without problems', function (done) {

                var _user = new User(doctor);
                _user.save(function (err) {
                    expect(err).to.be.null;

                    _user.jobTitle = '内科首席医生';
                    _user.save(function (err) {
                        expect(err).to.be.null;
                        expect(_user.jobTitle).to.equal('内科首席医生');
                        _user.remove(function () {
                            done();
                        });
                    });

                });

            });

            it('should fail to save an existing user with the same values', function (done) {

                var _user1 = new User(doctor);
                var _user2 = new User(doctor);

                _user1.save(function (err) {
                    expect(err).to.be.null;
                    _user2.save(function (err) {
                        expect(err).to.not.be.null;
                        _user1.remove(function () {
                            if (!err) {
                                _user2.remove(function () {
                                    done();
                                });
                            }
                            done();
                        });

                    });
                });
            });

            it('should show an error when try to save without fullName', function (done) {

                var _user = new User(doctor);
                _user.fullName = '';

                return _user.save(function (err) {
                    expect(err).to.not.be.null;
                    done();
                });
            });

            it('should show an error when try to save without sex', function (done) {

                var _user = new User(doctor);
                _user.sex = '';

                return _user.save(function (err) {
                    expect(err).to.not.be.null;
                    done();
                });
            });

            it('should show an error when try to save without password and provider set to local', function (done) {

                var _user = new User(doctor);
                _user.password = '';
                _user.provider = 'local';

                return _user.save(function (err) {
                    expect(err).to.not.be.null;
                    done();
                });
            });

            it('should show an error when try to save without cellPhone', function (done) {

                var _user = new User(doctor);
                _user.cellPhone = '';

                return _user.save(function (err) {
                    expect(err).to.not.be.null;
                    done();
                });
            });

            it('should show an error when try to save without avatarImage', function (done) {

                var _user = new User(doctor);
                _user.avatarImage = '';

                return _user.save(function (err) {
                    expect(err).to.not.be.null;
                    done();
                });
            });

            it('should show an error when try to save without jobTitle', function (done) {

                var _user = new User(doctor);
                _user.jobTitle = '';

                return _user.save(function (err) {
                    expect(err).to.not.be.null;
                    done();
                });
            });

            it('should show an error when try to save without license', function (done) {

                var _user = new User(doctor);
                _user.license = '';

                return _user.save(function (err) {
                    expect(err).to.not.be.null;
                    done();
                });
            });

        });

    });

    describe('Model User: Rep', function () {
        var rep;
        beforeEach(function (done) {
            rep = {
                workNo: 'CTU-001',
                fullName: '黄药师',
                companyName: '东邪药厂',
                brandName: '神雕牌',
                city: 'Shanghai',
                address: 'none',
                password: 'password',
                role: 'rep'
            };
            done();
        });

        describe('Method Save', function () {
            it('should begin without the test rep', function (done) {
                User.find({
                    workNo: rep.workNo
                }, function (err, reps) {
                    expect(err).to.be.null;

                    expect(reps.length).to.equal(0);
                    done();
                });
            });

            it('should be able to save without problems', function (done) {

                var _user = new User(rep);
                _user.save(function (err) {
                    expect(err).to.be.null;
                    _user.remove(function () {
                        done();
                    });
                });

            });

            it('should check that rep role are assigned and created properly', function (done) {

                var _user = new User(rep);
                _user.save(function (err) {
                    expect(err).to.be.null;
                    expect(_user.isRep()).to.equal(true);
                    _user.remove(function () {
                        done();
                    });
                });

            });

            it('should confirm that password is hashed correctly', function (done) {

                var _user = new User(rep);

                _user.save(function (err) {
                    expect(err).to.be.null;

                    expect(_user.hashed_password.length).to.not.equal(0);
                    expect(_user.salt.length).to.not.equal(0);
                    expect(_user.authenticate(rep.password)).to.equal(true);
                    _user.remove(function () {
                        done();
                    });

                });
            });

            it('should be able to create user and save user for updates without problems', function (done) {

                var _user = new User(rep);
                _user.save(function (err) {
                    expect(err).to.be.null;

                    _user.companyName = '桃花谭';
                    _user.save(function (err) {
                        expect(err).to.be.null;
                        expect(_user.companyName).to.equal('桃花谭');
                        _user.remove(function () {
                            done();
                        });
                    });

                });

            });

            it('should fail to save an existing user with the same values', function (done) {

                var _user1 = new User(rep);
                var _user2 = new User(rep);

                _user1.save(function (err) {
                    expect(err).to.be.null;
                    _user2.save(function (err) {
                        expect(err).to.not.be.null;
                        _user1.remove(function () {
                            if (!err) {
                                _user2.remove(function () {
                                    done();
                                });
                            }
                            done();
                        });

                    });
                });
            });

            it('should show an error when try to save without workNo', function (done) {

                var _user = new User(rep);
                _user.workNo = '';

                return _user.save(function (err) {
                    expect(err).to.not.be.null;
                    done();
                });
            });

            it('should show an error when try to save without fullName', function (done) {

                var _user = new User(rep);
                _user.fullName = '';

                return _user.save(function (err) {
                    expect(err).to.not.be.null;
                    done();
                });
            });

            it('should show an error when try to save without password and provider set to local', function (done) {

                var _user = new User(rep);
                _user.password = '';
                _user.provider = 'local';

                return _user.save(function (err) {
                    expect(err).to.not.be.null;
                    done();
                });
            });

            it('should show an error when try to save without address', function (done) {

                var _user = new User(rep);
                _user.address = '';

                return _user.save(function (err) {
                    expect(err).to.not.be.null;
                    done();
                });
            });

            it('should show an error when try to save without companyName', function (done) {

                var _user = new User(rep);
                _user.companyName = '';

                return _user.save(function (err) {
                    expect(err).to.not.be.null;
                    done();
                });
            });

            it('should show an error when try to save without brandName', function (done) {

                var _user = new User(rep);
                _user.brandName = '';

                return _user.save(function (err) {
                    expect(err).to.not.be.null;
                    done();
                });
            });

        });

    });
});
