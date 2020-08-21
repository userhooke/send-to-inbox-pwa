/**
 * Elements are for providing access to DOM elements
 */

export const formElement = document.querySelector('#form');
export const textareaElement = formElement.querySelector('textarea');
export const formSubmitElement = formElement.querySelector('button');

export const authElement = document.querySelector('#auth');
export const emailInputElement = authElement.querySelector('#email');
export const keyInputElement = authElement.querySelector('#key');
export const authSubmitElement = authElement.querySelector('button');
