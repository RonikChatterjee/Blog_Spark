import argon2 from 'argon2'

async function hashPassword(password) {
  // Hash the password using argon2
  /**
     The highlighted object contains parameters for configuring the Argon2 password hashing:

     1. `type: argon2.argon2id` - Specifies using the Argon2id variant, which is a hybrid of Argon2i and Argon2d providing both side-channel resistance and protection against GPU attacks

     2. `memoryCost: 65536` - Sets memory usage to 65536 KiB (64MB), affecting resistance to attacks

     3. `timeCost: 4` - Number of iterations (higher means slower hashing but more secure)

     4. `parallelism: 1` - Number of threads to use during hashing

     These parameters balance security and performance. The values used are reasonable defaults, though memory cost could be increased for more security at the cost of performance.
     */
  try {
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 4,
      parallelism: 1,
    })
    return hashedPassword
  } catch (err) {
    console.error(`❌ Error in hashPassword: ${err}`)
    throw new Error('Hashing failed')
  }
}

async function verifyPassword(hashedPassword, password) {
  // Verify the password with the hashed password
  try {
    return await argon2.verify(hashedPassword, password)
  } catch (err) {
    console.error(`❌ Error in verifyPassword: ${err}`)
    return false
  }
}

export { hashPassword, verifyPassword }
