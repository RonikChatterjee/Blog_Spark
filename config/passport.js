import { Users } from '../models/index.js'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GithubStrategy } from 'passport-github2'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import dotenv from 'dotenv'
dotenv.config()

// Configuration for Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google Profile:', profile)

        // Extract user information from the profile
        const { id, displayName, name, emails } = profile
        const googleId = id
        const firstname = name?.givenName || ''
        const lastname = name?.familyName || ''
        const fullname = displayName || `${firstname} ${lastname}`
        const email =
          emails && emails.length > 0 ? emails[0].value : null

        // Condition 1: Check if the Google Id already exists in the database
        let existingUser = await Users.findOne({ googleId: id })

        if (!existingUser) {
          // Google Id does not exist.

          // Condition 2: Check the email is present in the database
          existingUser = await Users.findOne({ email })

          if (!existingUser) {
            // Email does not exist. Create a new user
            await Users.insertOne({
              googleId,
              email,
              firstname,
              lastname,
              isVerified: true,
              oauthProvider: ['google'],
              hasPassword: false,
            })
          } else {
            // Email exists. Link Google Id to the existing user
            await Users.updateOne(
              { email },
              {
                googleId,
                isVerified: true,
                $push: { oauthProvider: 'google' },
              }
            )
          }
        }

        const user = await Users.findOne({ googleId: id })
        done(null, user)
      } catch (error) {
        console.log('Error in Google Strategy:', error)
        done(error, null)
      }
    }
  )
)

// Configuration for GitHub OAuth Strategy
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('GitHub Profile:', profile)

        // Extract user information from the profile
        const { id, displayName, emails } = profile
        const githubId = id
        const fullname = displayName
        const firstname = fullname?.split(' ')[0]
        const lastname = fullname?.split(' ').pop()

        // Extracting email from profile or fetching if not present
        let email = null

        if (emails && emails.length > 0) {
          email = emails[0].value
        } else {
          // GitHub may not always provide email in the profile
          // Fetch emails from GitHub API using the access token
          const resJson = await fetch(
            'https://api.github.com/user/emails',
            {
              method: 'GET',
              headers: {
                Authorization: `token ${accessToken}`,
              },
            }
          )
          const resValue = await resJson.json()
          const primaryEmail = resValue.find(
            e => e.primary && e.verified
          )
          if (primaryEmail) email = primaryEmail.email
          else if (resValue.length > 0) email = resValue[0].email
        }

        if (!email) {
          // Handle error: Email is required
          return done(
            new Error('Email not available from GitHub'),
            null
          )
        }

        // Condition 1: Check if the GitHub Id already exists in the database
        let existingUser = await Users.findOne({ githubId })

        if (!existingUser) {
          // GitHub Id does not exist.

          // Condition 2: Check the email is present in the database
          existingUser = await Users.findOne({ email })

          if (!existingUser) {
            // Email does not exist. Create a new user
            await Users.insertOne({
              githubId,
              email,
              firstname,
              lastname,
              isVerified: true,
              oauthProvider: ['github'],
              hasPassword: false,
            })
          } else {
            // Email exists. Link GitHub Id to the existing user
            await Users.updateOne(
              { email },
              {
                githubId,
                isVerified: true,
                $push: { oauthProvider: 'github' },
              }
            )
          }
        }
        const user = await Users.findOne({ githubId })
        done(null, user)
      } catch (error) {
        console.log('Error in GitHub Strategy:', error)
        done(error, null)
      }
    }
  )
)

// Configuration for Facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, name, emails, gender } = profile

      const facebookId = id
      if (!facebookId) {
        return done(new Error('Facebook ID not available'), null)
      }

      const firstname = name?.givenName
      const lastname = name?.familyName

      let email = null
      if (emails && emails.length > 0) {
        email = emails[0].value
      }
      if (!email) {
        return done(
          new Error('Email not available from Facebook'),
          null
        )
      }

      try {
        let existingUser = await Users.findOne({ facebookId })
        if (!existingUser) {
          existingUser = await Users.findOne({ email })
          if (!existingUser) {
            await Users.insertOne({
              facebookId,
              email,
              firstname,
              lastname,
              gender,
              isVerified: true,
              oauthProvider: ['facebook'],
              hasPassword: false,
            })
          } else {
            if (!existingUser.gender) {
              await Users.updateOne(
                { email },
                {
                  facebookId,
                  gender,
                  isVerified: true,
                  $push: { oauthProvider: 'facebook' },
                }
              )
            } else {
              await Users.updateOne(
                { email },
                {
                  facebookId,
                  isVerified: true,
                  $push: { oauthProvider: 'facebook' },
                }
              )
            }
          }
        }
      } catch (error) {
        console.log('Error in Facebook Strategy:', error)
        done(error, null)
      }
    }
  )
)
