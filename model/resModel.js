class BaseModel {
    constructor(data, msg) {
        this.data = {}
        this.state = ''
        this.msg = ''
        if (typeof data === 'string') {
            this.msg = data
            data = null
            msg = null
        }
        if (data) {
            this.data = data
        }
        if (msg) {
            this.msg = msg
        }
    }
}

class SuccessModel extends BaseModel {
    constructor(data, msg) {
        super(data, msg)
        this.state = 1
    }
}

class ErrorModel extends BaseModel {
    constructor(data, msg) {
        super(data, msg)
        this.state = 0
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}