const sequelize= require('sequelize');

const db= new sequelize(
    'enlinea',
    'root',
    'admin',
    {
        dialect: 'mysql',
        host: 'localhost'
    }
)

const account_status= db.define('deactive',{
    username: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true
    },
    status: sequelize.STRING
})

const users= db.define('users',{
    username: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    },
    first_name: sequelize.STRING,
    last_name: sequelize.STRING,
    email_id: sequelize.STRING,
    mobile_number: sequelize.STRING,
    DOB: sequelize.STRING,
    gender: sequelize.STRING,
    profile_picture: sequelize.STRING
});

//table for friend list records
const friends= db.define('friends',{
    username: {
        type: sequelize.STRING,
        allowNull: false
    },
    requested_user: {
        type: sequelize.STRING,
        allowNull: false
    },
    status: sequelize.STRING
})

function admin_callback(){
    db.query(`INSERT IGNORE INTO users (username,password,first_name,last_name,profile_picture)` +
            `VALUES ('admin','9073326812','Admin','Admin','000.jpg')`);
    db.query(`INSERT IGNORE INTO deactives (username,status) VALUES ('admin','active')`);
}

db.sync().then(function(){ 
    console.log('Database is syncronized')
    admin_callback();
});



module.exports = {
    db,
    users,
    account_status
};