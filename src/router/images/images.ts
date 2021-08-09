import path from 'path';

import { RequestHandler } from 'express';
import Image from '../../lib/model/image';
import { getRepository } from 'typeorm';

const msg: string = 'GET /images/';

const addImage: RequestHandler = async (req, res, next) => {
  try {
    if (req.file !== undefined) {
      const { mimetype, size, path } = req.file;
      const id = req.file.filename;

      const image: Image = await getRepository(Image).create({
        id: id,
        path: path,
        mimetype: mimetype,
        size: size,
      });
      getRepository(Image).save(image);
      res.status(200).json({
        msg: 'Image Saved Successfully',
        id: id,
        path: path,
        mimetype: mimetype,
        size: size,
      });
    } else throw new Error(); //TODO
  } catch (err) {
    next(err);
  }

  return next();
};

const getImage: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const row = await getRepository(Image).findOne({ where: { id: id } });

    if (row !== undefined) {
      const dirname = path.resolve();
      const fullPath = path.join(dirname, row.path);
      return res.status(200).type(row.mimetype).sendFile(fullPath);
    } else throw new Error('no way'); //TODO
  } catch (err) {
    next(err);
  }

  return next();
};

const test: RequestHandler = (req, res, next) => {
  res.send(msg);
  return next();
};

export { test, addImage, getImage };