import express from 'express'
import passport from 'passport'
const router = express.Router()
import { requireGuest } from '../middlewares/authentication.middleware.js'
import {
  handleLoginWithGoogle,
  handleLoginWithGitHub,
  handleLoginWithFacebook,
} from '../controllers/oauth.controller.js'

router
  .route('/google')

  /**
   * @route   GET /auth/google
   * @access  Guest Only
   * @middleware requireGuest
   * @description Initiate Google OAuth20 authentication
   * @returns {Redirects} Redirects to Google for authentication
   * @controller N/A
   */
  .get(
    requireGuest,
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
    })
  )

router
  .route('/google/callback')

  /**
   * @route   GET /auth/google/callback
   * @access  Google Server
   * @middleware N/A
   * @description Google OAuth20 callback URL
   * @returns {Redirects} Redirects to home page on successful authentication or login page on failure
   * @controller handleLoginWithGoogle
   */
  .get(
    passport.authenticate('google', {
      failureRedirect: '/user/login',
      session: false,
    }),
    handleLoginWithGoogle
  )

router
  .route('/github')

  /**
   * @route   GET /auth/github
   * @access  Guest Only
   * @middleware requireGuest
   * @description Initiate GitHub OAuth2 authentication
   * @returns {Redirects} Redirects to GitHub for authentication
   * @controller N/A
   */
  .get(
    requireGuest,
    passport.authenticate('github', {
      scope: ['user:email'],
      session: false,
    })
  )

router
  .route('/github/callback')

  /**
   * @route   GET /oauth/github/callback
   * @access  GitHub Server
   * @middleware N/A
   * @description GitHub OAuth2 callback URL
   * @returns {Redirects} Redirects to home page on successful authentication or login page on failure
   * @controller handleLoginWithGitHub
   */
  .get(
    passport.authenticate('github', {
      failureRedirect: '/user/login',
      session: false,
    }),
    handleLoginWithGitHub
  )

router
  .route('/facebook')

  /**
   * @route   GET /oauth/facebook
   * @access  Guest Only
   * @middleware requireGuest
   * @description Initiate Facebook OAuth2 authentication
   * @returns {Redirects} Redirects to Facebook for authentication
   * @controller N/A
   */
  .get(
    requireGuest,
    passport.authenticate('facebook', {
      scope: ['email', 'public_profile', 'user_gender'],
      session: false,
    })
  )

router
  .route('/facebook/callback')

  /**
   * @route   GET /oauth/facebook/callback
   * @access  Facebook Server
   * @middleware N/A
   * @description Facebook OAuth2 callback URL
   * @returns {Redirects} Redirects to home page on successful authentication or login page on failure
   * @controller handleLoginWithFacebook
   */
  .get(
    passport.authenticate('facebook', {
      failureRedirect: '/user/login',
      session: false,
    }),
    handleLoginWithFacebook
  )

export default router
