import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import fetch from 'node-fetch';

@Controller('geocode')
export class GeocodeController {
  @Get('reverse')
  async reverseGeocode(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
    @Res() res: Response
  ) {
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Missing lat or lon' });
    }
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
      const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
      const data = await response.json();
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch geocode data' });
    }
  }
}
