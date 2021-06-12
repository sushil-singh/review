exports.isInvidPayload = (input) => {
    if (!input.review ){
       return 'Missing "review" property'
    }else if(!input.author ){
        return 'Missing "author" property'
    }else if(!input.review_source ){
        return 'Missing "review_source" property'
    }else if(!input.rating ){
        return 'Missing "rating" property'
    }else if(!input.product_name ){
        return 'Missing "product_name" property'
    }else if(isNaN(input.rating) ){
        return '"Not a valid rating'
    }else if(input.rating <  1 || input.rating >  5){
        return 'rating can not be less than 1 and above 5'
    }
    return false
}