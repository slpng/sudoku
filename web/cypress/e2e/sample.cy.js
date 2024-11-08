/// <reference types="cypress" />

import Chance from "chance"
const chance = new Chance()

describe('Authorization test', () => {
  it('should succeed', () => {
    cy.on('uncaught:exception', (err, runnable) => {
      return false
    })

    cy.visit('http://localhost:3070/')
    cy.url().should('include', '/login')

    cy.get('input[name=username]').type('slpng')
    cy.get('input[name=password]').type('123123')
    cy.get('button[type=submit]').click()

    cy.url().should('include', '/home')
  })
})

describe('Authorization failed test', () => {
  it('should fail', () => {
    cy.on('uncaught:exception', (err, runnable) => {
      return false
    })

    cy.visit('http://localhost:3070/')
    cy.url().should('include', '/login')

    cy.get('input[name=username]').type('slpng123')
    cy.get('input[name=password]').type('123123')
    cy.get('button[type=submit]').click()

    cy.get('p').should('contain', 'Неверное имя пользователя или пароль')

    // cy.should('contain', 'Неверное имя пользователя или пароль')
  })
})