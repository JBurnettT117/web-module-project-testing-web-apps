import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render (<ContactForm />);
});

test('renders the contact form header', () => {
    render(<ContactForm />);
    const header = screen.queryByText(/Contact Form/i);
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameInput, "Josh");
    const errorMessages = await screen.findAllByTestId("error");
    expect(errorMessages).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);
    const button = screen.getByRole("button");
    userEvent.click(button);
    await waitFor(() => {
        const errorCount = screen.queryAllByTestId("error");
        expect(errorCount).toHaveLength(3);
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render (<ContactForm />);

    const firstNameInput = screen.getByLabelText(/First Name*/i);
    const lastNameInput = screen.getByLabelText(/Last Name*/i);
    const button = screen.getByRole("button");

    userEvent.type(firstNameInput, "Joshua");
    userEvent.type(lastNameInput, "Burnett");
    userEvent.click(button);

    const errorMessages = await screen.findAllByTestId("error");
    expect(errorMessages).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render (<ContactForm />);
    const emailInput = screen.getByLabelText(/Email*/i);
    userEvent.type(emailInput, "not an email");
    const emailError = await screen.findByText(/email must be a valid email address/i);
    expect(emailError).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);
    const button = screen.getByRole("button");
    userEvent.click(button);
    const lastNameError = await screen.findByText(/lastName is a required field/i);
    expect(lastNameError).toBeInTheDocument;
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const button = screen.getByRole("button");

    userEvent.type(firstNameInput, "Joshua");
    userEvent.type(lastNameInput, "Burnett");
    userEvent.type(emailInput, "11riku99@gmail.com");
    userEvent.click(button);

    await waitFor(() => {
        const firstNameReturn = screen.queryByText("Joshua");
        const lastNameReturn = screen.queryByText("Burnett");
        const emailReturn = screen.queryByText("11riku99@gmail.com");
        const messageReturn = screen.queryByTestId("messageDisplay");

        expect(firstNameInput).toBeInTheDocument();
        expect(lastNameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(messageReturn).not.toBeInTheDocument();
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const messageInput = screen.getByLabelText(/Message/i);
    const button = screen.getByRole("button");

    userEvent.type(firstNameInput, "Joshua");
    userEvent.type(lastNameInput, "Burnett");
    userEvent.type(emailInput, "11riku99@gmail.com");
    userEvent.type(messageInput, "This is a message");
    userEvent.click(button);

    await waitFor(() => {
        const firstNameReturn = screen.queryByText("Joshua");
        const lastNameReturn = screen.queryByText("Burnett");
        const emailReturn = screen.queryByText("11riku99@gmail.com");
        const messageReturn = screen.queryByText("This is a message");

        expect(firstNameInput).toBeInTheDocument();
        expect(lastNameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(messageReturn).toBeInTheDocument();
    })
});
