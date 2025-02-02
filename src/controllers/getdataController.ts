import { Request, Response } from 'express';
import  Image  from '../models/tables/image'; // User 모델의 경로에 따라 조정
import  Record  from '../models/tables/record'; // User 모델의 경로에 따라 조정
import  User  from '../models/tables/user'; // User 모델의 경로에 따라 조정

export const getImageRecord = async (req: Request, res: Response) => {
  try {
    const userId = req.user; // 라우터 설정에 따라 'id'를 조정할 수 있습니다.
    console.log('getdata req.user', userId)
    
    const userData = await Record.findAll({
      where: { kakaoId: userId },
      include: [
        {
          model:Image
        },
      ],
    });
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getRecordsWithImages = async (req: Request, res: Response) => {
  try {
    const userId = req.user;
    const records = await Record.findAll({
      where: { kakaoId: userId },
      attributes: ["recordId", "recordValue"]
    });

    if (!records) {
      return res.status(404).json({ error: 'No records found' });
    }

    const recordsWithImages = [];
    for (const record of records) {
      const images = await Image.findAll({
        where: { recordId: record.recordId },
        attributes: ["id", "imageName", "GPSLatitude", "GPSLongitude", "CreateDate"],
      });

      recordsWithImages.push({ record, images });
    }

    return res.json(recordsWithImages);
  } catch (error) {
    res.status(500).send('서버 오류가 발생했습니다.');
  }
};