const dbConnection = require('./connection');

const getSchemas = () => {
	return dbConnection.then(session => session.getSchemas());
}

const registerUser = (params) => {
	let sqlQuery;

	if (params.type === 'email')
		sqlQuery = `INSERT INTO referra.USERS (firstname, lastname, signuptype, signuptypelabel, email) VALUES ('${params.firstname}', '${params.lastname}', '${params.signuptype}', '${params.signuptypelabel}', '${params.email}');`
		
	else if (params.type === 'phonenumber')
		sqlQuery = `INSERT INTO referra.USERS (username, firstname, lastname, signuptype, signuptypelabel, phonenumber, password) VALUES ('${params.username}', '${params.firstname}', '${params.lastname}', '${params.signuptype}', '${params.signuptypelabel}', '${params.phonenumber}', '${params.password}');`

	return dbConnection.then(session => {
		return session
			.sql(sqlQuery)
			.execute()
			.then(() => {
				return {
					statusCode: 200,
					info: 'NEW_USER_CREATED'
				}
			})
			.catch(error => {
				return {
					statusCode: 500,
					info: 'INTERNAL_SERVER_ERROR',
					message: 'There was an error completing your request. Please try again.',
					error: error
				}
			});
	})

}

const getUserInfo = (query) => {
	const email = query.email;
	const id = query.id;

	if (!email && !id) {
		return {
			statusCode: 422,
			info: 'INVALID_PARAMETERS',
			message: 'Send either email ID or user ID to retrieve user info.'
		}
	}

	let sqlQuery;

	if (email)
		sqlQuery = `SELECT * FROM referra.USERS where email = '${email}';`;
	if (id)
		sqlQuery = `SELECT * FROM referra.USERS where id = '${id}';`;

	let results = [];

	return dbConnection.then(session => {
		return session.sql(sqlQuery)
			.execute(row => results.push(row))
			.then(() => {
				if (results.length === 0)
					return {
						statusCode: 404,
						info: 'USER_NOT_FOUND',
						message: 'No users found matching the specified parameters.'
					}
				else if (results.length > 1)
					return {
						statusCode: 200,
						info: 'MULTIPLE_USERS_FOUND',
						message: 'There were multiple users found matching the specified parameters.'
					}
				else
					return {
						statusCode: 200,
						user: {
							id: results[0][0],
							username: results[0][1],
							firstname: results[0][3],
							lastname: results[0][4],
							email: results[0][5],
							signuptype: results[0][6],
							signuptypelabel: results[0][7],
							phonenumber: results[0][8]
						}
					}
			})
			.catch(error => {
				return {
					statusCode: 500,
					info: 'INTERNAL_SERVER_ERROR',
					message: 'There was an unexpected system error recorded. Please try again.',
					error: error
				}
			});
	})
}

module.exports = {
	getSchemas,
	registerUser,
	getUserInfo
}