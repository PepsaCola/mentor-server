import express from "express";
import authenticate from "../midlware/authenticate.js";
import contactsController from "../controllers/contactsController.js";

const contactsRouter = express.Router();

contactsRouter.get('/invitations/:id',authenticate, contactsController.getContactsInvitations)
contactsRouter.post('/',authenticate,contactsController.postContact)
contactsRouter.post('/reject',authenticate,contactsController.rejectContact)
contactsRouter.get('/:id',authenticate,contactsController.getContacts)

export default contactsRouter;