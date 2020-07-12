import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';
import createError from 'http-errors';
import { getAuctionById } from './getAuction';
import { uploadPictureToS3 } from '../lib/uploadPictureToS3';
import { setAuctionPictureUrl } from '../lib/setAuctionPictureUrl';

export async function uploadAuctionPicture(event) {
  const { email } = event.requestContext.authorizer;
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);

  if (auction.seller !== email) {
    throw new createError.Forbidden('You do not own this auction.');
  }

  const base64String = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64String, 'base64');
  if (buffer.toString('base64') !== base64String) {
    throw new createError.BadRequest(
      'An invalid base64 string was provided for the auction image.',
    );
  }

  let updatedAuction;

  try {
    const pictureUrl = await uploadPictureToS3(auction.id + '.jpg', buffer);
    updatedAuction = await setAuctionPictureUrl(id, pictureUrl);
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = middy(uploadAuctionPicture)
  .use(httpErrorHandler())
  .use(cors());
