module.exports = {
    GenID: function (data) {
        let ids = data.map(
            function (e) {
                return Number.parseInt(e.id)
            }
        )
        return Math.max(...ids) + 1;
    }
}