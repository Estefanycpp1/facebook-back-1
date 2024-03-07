import yup from 'yup';

function sch (schema:any){
    return yup.object().shape(schema);
}



const schemas = {
    loginSchema : sch({
        identifier: yup.string().required("Email is required"),
        password: yup.string().required("Password is required"),
    }),

    registerSchema : sch({
        email: yup.string().email().required("Email is required"),
        password: yup.string().required("Password is required"),
        username: yup.string().required("Username is required"),
        fullName: yup.string().required("fullname is required"),
    }),

    updateUserDataSchema : sch({
        newPassword: yup.string(),
        oldPassword: yup.string(),
        username: yup.string(),
        fullName: yup.string(),
        email: yup.string().email(),
        isDisabled: yup.boolean(),
        userId: yup.string().required("User id is required"),
        isVerified: yup.boolean(),
    }),

    createEcoSchema : sch({
        userId: yup.string().required("User id is required"),
        content: yup.string().required("Content is required"),
        attachmentUrls: yup.array().of(yup.string()),
        mentions: yup.array().of(yup.string()),
        hashtags: yup.array().of(yup.string()),
        
        
    }),

    replySchema : sch({
        userId: yup.string().required("User id is required"),
        content: yup.string().required("Content is required"),
        attachmentUrls: yup.array().of(yup.string()),
        mentions: yup.array().of(yup.string()),
        hashtags: yup.array().of(yup.string()),
        isReply: yup.string().required("Reply id is required"),
        
    }),


    likeSchema : sch({
        userId: yup.string().required("User id is required"),
        ecoId: yup.string().required("Post id is required"),
    }),

    followSchema : sch({
        userId: yup.string().required("User id is required"),
        idFollowing: yup.string().required("Following user id is required"),
    }),

    


}
    



export default schemas;