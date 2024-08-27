    import mongoose from 'mongoose';
    import jwt from 'jsonwebtoken'
    import bcrypt from 'bcrypt'
    const userSchema = new mongoose.Schema({
        username:{
            type:String,
            required:true,
            unique:[true,'username already exists! 🤷‍♂️']
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
            select:false,
            minLength:[8,'password atleast 8 character long']
        },
        avatar:{
            public_id:{
                type:String,
            },
            secure_url:{
                type:String,
            }  
        }
    },{timestamps:true})

    userSchema.methods={
        jwtToken: async function(){
            return await jwt.sign(
                {
                    id:this._id,
                    email:this.email,
                },
                process.env.SECRET,
                {
                    expiresIn:'1d'
                }
            )
        },
        comparePassword: async function(plainTextPassword){
            return await bcrypt.compare(plainTextPassword,this.password);
        }
    }

    userSchema.pre('save',async function(next){
        if(!this.isModified('password')){
            return next();
        }
        this.password = await bcrypt.hash(this.password,10);
    })

    const User = mongoose.model("User",userSchema)

    export default User