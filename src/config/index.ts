const UserKey = 'fc6YazAyQkWverz52EaKDtJv3S3q9hHEzKMR8';

export const Config = {
  port: 3333,
  dev: true,
  // Auth configuration
  userAuth: 'username',
  userKey: UserKey,
  saltRound: 10,
  // Upload configuration
  ImagePath: './upload',
  // Reset password configuration
  resetpass: {
    host: 'http://localhost',
    amount: 24,
    unit: 'hours',
  },
  email: {
    provider: {
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      auth: {
        user: 'dev.mail@gmail.com',
        pass: 'devpassword!',
      },
    },
    from: 'dev@yourhost.name',
  },
  // Dir & Path
  path: {
    preFixApi: 'api',
    upload: '/upload',
    static: __dirname + '/../upload',
  },
  // Database configuration
  database: {
    prod: {
      host: 'production_host',
      username: 'production_username',
      password: 'production_password',
      port: 3306,
      database: 'production_databasename',
    },
    dev: {
      host: 'localhost',
      username: 'root',
      password: '',
      port: 3306,
      database: 'nestjs',
    },
  },
};
