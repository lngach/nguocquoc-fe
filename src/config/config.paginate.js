const DEFAULT_PER_PAGE = 9
const DEFAULT_OFFSET = 0
const DEFAULT_PAGE = 1
const paginate = (req, res, next) => {
        return {
            page: parseInt(req.query.page) || DEFAULT_PAGE,
            offset: req.query.page ? (req.query.page - 1) * (req.query.per || DEFAULT_PER_PAGE) : DEFAULT_OFFSET,
            per: parseInt(req.query.per) || DEFAULT_PER_PAGE
        }
    }

module.exports  = paginate