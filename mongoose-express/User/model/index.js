'use strict';

var crypto = require('crypto'),
    MD5    = require('MD5');

module.exports = function (Mango, mongoose, Schema, _, $, queryBuilder) {
    /**
     * Validations
     */
    var validatePresenceOf = function (value) {
        return (this.provider && this.provider !== 'local') || (value && value.length);
    };
    var validateUnique = function (key, roles) {
        return function (value, callback) {
            if (this.role && roles.indexOf(this.role) !== -1 && value && value.length) {
                var User    = Mango.User,
                    options = {};
                options[key] = value;
                User.find({
                    $and: [options, {
                        _id: {
                            $ne: this._id
                        }
                    }]
                }, function (err, users) {
                    callback(err || users.length === 0);
                });
            } else {
                callback(true);
            }
        };
    };
    /**
     * @param value {string} the workNo value
     * @param callback
     */
    var validateUniqueRep = function (value, callback) {
        if (this.isRep()) {
            var User    = Mango.User,
                options = {
                    workNo: value,
                    companyName: this.companyName
                };
            User.find({
                $and: [options, {
                    _id: {
                        $ne: this._id
                    }
                }]
            }, function (err, users) {
                callback(err || users.length === 0);
            });
        } else {
            callback(true);
        }
    };

    var mustHaveBy = function (roles) {
        return function (value) {
            if (this.role && roles.indexOf(this.role) !== -1) {
                return (value && value.length);
            } else {
                return true;
            }
        };
    };

    /**
     * Nested Object Schema
     */
    var doctorTipSchema = new Schema({
        disease: {
            type: String,
            required: true
        },
        tips: {
            type: String,
            required: true
        },
        experiences: {
            type: String,
            required: true
        },
        preVisitRequirements: {
            type: [String]
        },
        acceptClinicVisit: {
            type: Boolean,
            required: true
        },
        acceptOnlineInquire: {
            type: Boolean,
            required: true
        }
    });
    var repProductSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            required: true
        }
    });
    var scheduleSchema = new Schema({
        startAt: {
            type: Date,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        relatedAppointment: {
            type: Schema.Types.ObjectId,
            ref: 'Appointment'
        },
        note: {
            type: String
        }
    });

    /**
     * User Schema
     */
    var UserSchema = new Schema({
        /**
         * rep
         * doctor
         * patient
         */
        role: {
            type: String,
            enum: [
                'patient',
                'doctor',
                'rep',
                'admin'
            ],
            required: true
        },
        fullName: {
            type: String,
            default: null,
            validate: [mustHaveBy(['rep', 'doctor']), 'Full name cannot be blank']
        },
        avatarImage: {
            type: String,
            default: null,
            validate: [mustHaveBy('doctor'), 'Avatar Image cannot be blank']
        },
        cellPhone: {
            type: String,
            index: true,
            default: null,
            validate: [
                {validator: mustHaveBy(['patient', 'doctor']), msg: 'Cellphone number cannot be blank'},
                {
                    validator: validateUnique('cellPhone', ['rep', 'patient', 'doctor']),
                    msg: 'cellphone number is already in-use'
                }
            ]
        },
        qqNumber: {
            type: String
        },
        weChatId: {
            type: String
        },
        age: {
            type: String
        },
        email: {
            type: String,
            // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly
            // with RFC2822 guide lines
            match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
            validate: [validateUnique('email', ['rep', 'doctor', 'patient']), 'E-mail address is already in-use']
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        hashed_password: {
            type: String,
            validate: [validatePresenceOf, 'Password cannot be blank']
        },
        provider: {
            type: String,
            default: 'local'
        },
        salt: String,
        resetPasswordToken: String,
        resetPasswordExpires: Date,

        /**
         * doctor
         * patient
         */
        sex: {
            type: String,
            enum: [
                'male',
                'female'
            ],
            default: 'male',
            validate: [mustHaveBy(['patient', 'doctor']), 'Sex cannot be blank']
        },

        /**
         * rep
         * patient
         */
        address: {
            type: String,
            default: null,
            validate: [mustHaveBy(['rep', 'patient', 'doctor']), 'Address cannot be blank']
        },
        city: {
            type: String,
            default: null,
            validate: [mustHaveBy(['rep', 'patient', 'doctor']), 'City cannot be blank']
        },

        /**
         * patient
         */
        birthDate: {
            type: Date,
            default: null,
            validate: [mustHaveBy('patient'), 'Birth date cannot be blank']
        },
        nickName: {
            type: String
        },
        bloodType: {
            type: String,
            enum: [
                'A+',
                'A-',
                'B+',
                'B-',
                'AB+',
                'AB-',
                'O+',
                'O-',
                'unknown'
            ]
        },
        follow_doctor: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],

        /**
         * doctor
         */
        IDinEight: {
            type: String,
            validate: [
                {validator: mustHaveBy('doctor'), msg: 'MD5 ID cannot be blank'},
                {validator: validateUnique('IDinEight', 'doctor'), msg: 'ID in Eight is already in-use'}
            ]
        },
        jobTitle: {
            type: String,
            default: null,
            validate: [mustHaveBy('doctor'), 'Job Title cannot be blank']
        },
        license: {
            type: String,
            default: null,
            validate: [
                {validator: mustHaveBy('doctor'), msg: 'License cannot be blank'},
                {validator: validateUnique('license', 'doctor'), msg: 'license is already in-use'}
            ]
        },
        hospitalName: {
            type: String,
            default: null,
            validate: [
                {validator: mustHaveBy('doctor'), msg: 'Hospital name cannot be blank'}
            ]
        },
        hospitalCity: {
            type: String,
            default: null,
            validate: [
                {validator: mustHaveBy('doctor'), msg: 'Hospital city info cannot be blank'}
            ]
        },
        hospitalLocation: {
            type: String,
            default: null
        },
        department: {
            type: String,
            default: null,
            validate: [
                {validator: mustHaveBy('doctor'), msg: 'Department info cannot be blank'}
            ]
        },
        workPhoneNumber: {
            type: String
        },
        skills: [doctorTipSchema],
        calendar: [scheduleSchema],
        follow_by_patient: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        serve_by_rep: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],

        /**
         * rep
         */
        workNo: {
            type: String,
            default: null,
            validate: [
                {validator: mustHaveBy('rep'), msg: 'Work Number cannot be blank'},
                {validator: validateUniqueRep, msg: 'Work Number in the company is already in-use'}
            ]
        },
        companyName: {
            type: String,
            default: null,
            validate: [mustHaveBy('rep'), 'Company Name cannot be blank']
        },
        brandName: {
            type: String,
            default: null,
            validate: [mustHaveBy('rep'), 'Brand Name cannot be blank']
        },
        products: [repProductSchema],
        serve_doctor: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],

        /**
         * admin
         */
        adminNo: {
            type: String,
            default: null,
            validate: [
                {validator: mustHaveBy('admin'), msg: 'Admin use must be specified a number'}
            ]
        }
    });

    /**
     * Virtuals
     */
    UserSchema.virtual('password').set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.hashPassword(password);
    }).get(function () {
        return this._password;
    });

    /**
     * Pre-save hook
     */
    UserSchema.pre('save', function (next) {

        var self = this;

        if (this.isNew && this.provider === 'local' && this.password && !this.password.length) {
            return next(new Error('Invalid password'));
        }

        if (this.isDoctor()) {
            this.IDinEight = MD5(self.cellPhone + self.fullName);
        }
        next();
    });

    /**
     * Methods
     */
    UserSchema.methods = {

        /**
         * Is{SomeOne} - check if the user is an {role} user
         *
         * @return {Boolean}
         * @api public
         */
        isAdmin: function () {
            return this.role.indexOf('admin') !== -1;
        },

        isDoctor: function () {
            return this.role.indexOf('doctor') !== -1;
        },

        isPatient: function () {
            return this.role.indexOf('patient') !== -1;
        },

        isRep: function () {
            return this.role.indexOf('rep') !== -1;
        },

        /**
         * Authenticate - check if the passwords are the same
         *
         * @param {String} plainText
         * @return {Boolean}
         * @api public
         */
        authenticate: function (plainText) {
            return this.hashPassword(plainText) === this.hashed_password;
        },

        /**
         * Make salt
         *
         * @return {String}
         * @api public
         */
        makeSalt: function () {
            return crypto.randomBytes(16).toString('base64');
        },

        /**
         * Hash password
         *
         * @param {String} password
         * @return {String}
         * @api public
         */
        hashPassword: function (password) {
            if (!password || !this.salt) {
                return '';
            }
            var salt = new Buffer(this.salt, 'base64');
            return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
        },

        /**
         * Check if user is available
         * @param {Date} startAt
         * @param {Number} duration Unit: minute
         * @returns {boolean}
         */
        isAvailable: function (startAt, duration) {
            // need validation on startAt & duration
            if (!this.isDoctor()) {
                return false;
            }
            if (!this.calendar || this.calendar.length === 0) {
                return true;
            }

            var startTime = _.cloneDeep(startAt),
                i         = 0,
                max       = this.calendar.length,
                previous,
                self      = this;

            //loop doctor's calendar
            for (; i < max; i += 1) {
                if (this.calendar[i].startAt === startTime) {
                    return false;
                } else if (this.calendar[i].startAt > startTime) {
                    startTime.setMinutes(startTime.getMinutes() + duration);
                    if (startTime > this.calendar[i].startAt) {
                        return false;
                    }
                    if (i === 0) {
                        return true;
                    }
                    previous = _.cloneDeep(self.calendar[i - 1].startAt);
                    previous.setMinutes(previous.getMinutes() + self.calendar[i - 1].duration);
                    startTime.setMinutes(startTime.getMinutes() - duration);
                    return previous <= startTime;
                }
            }
            previous = _.cloneDeep(self.calendar[i - 1].startAt);
            previous.setMinutes(previous.getMinutes() + self.calendar[i - 1].duration);
            return previous <= startTime;
        },

        /**
         * Free an appointment from my calendar. Then I will be available at that time
         * @param startAt
         * @param duration
         * @param appointmentId
         * @param cb
         */
        freeMe: function (startAt, duration, appointmentId, cb) {
            var i, max = this.calendar.length;
            for (i = 0; i < max; i += 1) {
                if (this.calendar[i].relatedAppointment === appointmentId) {
                    break;
                }
            }
            this.calendar.splice(i, 1);
            this.save(function (err) {
                cb(['MongoSaveError', err]);
            });
        },

        /**
         * Get busy with an appointment.
         * @param startAt
         * @param duration
         * @param appointmentId
         */
        busyWithAnAppointment: function (startAt, duration, appointmentId) {
            //loop doctor's calendar
            if (!this.calendar) {
                this.calendar = [];
            }

            var i   = 0,
                max = this.calendar.length;
            for (; i < max; i += 1) {
                if (this.calendar[i].startAt > startAt) {
                    break;
                }
            }
            this.calendar.splice(i, 0, {
                startAt: startAt,
                duration: duration,
                relatedAppointment: appointmentId,
                note: 'Busy with an appointment this time'
            });
        },

        /**
         * Hide security sensitive fields
         *
         * @returns {*|Array|Binary|Object}
         */
        toJSON: function () {
            var obj = this.toObject();
            delete obj.hashed_password;
            delete obj.salt;
            delete obj.__v;
            delete obj.provider;

            //remove empty properties
            _.forOwn(obj, function (value, key) {
                if (_.isDate(value)) {
                    return;
                }
                if (_.isNumber(value) && !_.isNaN(value) && !_.isFinite(value)) {
                    return;
                }
                if (_.isEmpty(value)) {
                    delete obj[key];
                }
            });

            return obj;
        }
    };

    UserSchema.statics.modernQuery = queryBuilder();

    var User = mongoose.model('User', UserSchema);
    User.modernQuery(User);
    Mango.User = User;
};
