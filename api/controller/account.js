const accounts = require('../database/account')

module.exports = function (pool) {
	return {
		async createAccount (req, res) {
			const { firstName, lastName, email, password } = req.enforcer.body
			const userId = await accounts.createAccount(pool, firstName, lastName, email, password)
			if (userId) {
				res.set('location', '/api/accounts/' + userId)
					.enforcer
					.status(201)
					.send()
			} else {
				res.enforcer.status(409).send()
			}
		},

		async updateAccount (req, res) {
			const data = req.enforcer.body
			const { userId } = req.enforcer.params

			const client = await pool.connect()
			try {
				await client.query('BEGIN')
				let account = await accounts.getAccount(client, userId)
				if (account === undefined) {
					res.enforcer.status(404).send()
				} else {
					await accounts.updateAccount(client, userId, data)
					res.enforcer.status(200).send()
				}
				await client.query('COMMIT')
			} catch (e) {
				await client.query('ROLLBACK')
				throw e
			} finally {
				client.release()
			}
		},

		async deleteAccount (req, res) {
			const { userId } = req.enforcer.params
			await accounts.deleteAccount(pool, userId)
			res.enforcer.status(204).send()
		},

		async login (req, res) {

		},

		async logout (req, res) {

		}
	}
}