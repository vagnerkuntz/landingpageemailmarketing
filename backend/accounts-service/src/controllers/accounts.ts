import { Request, Response, NextFunction } from 'express';
import { IAccount } from '../models/account';

const accounts: IAccount[] = [{
  id: 1,
  name: 'John Doe',
  email: 'johndoe@email.com',
  password: '123456',
  status: 1
}];

function getAccounts(req: Request, res: Response, next: NextFunction) {
  res.json(accounts);
}

function getAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    const index = accounts.findIndex(item => item.id === id);
    
    if (index === -1) {
      return res.status(404).end();
    }

    return res.json(accounts[index]);
  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
}

function addAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const newAccount = req.body as IAccount;
    accounts.push(newAccount);
    res.status(201).json(newAccount);
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
}

export default {
  getAccounts,
  getAccount,
  addAccount,
}