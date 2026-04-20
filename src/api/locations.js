import axiosInstance from './axiosInstance';

export const getCities = async () => {
  try {
    const response = await axiosInstance.get('/api/locations/cities');
    return response.data;
  } catch (error) {
    console.warn('Backend cities API failed, using fallback city list', error);
    // Fallback data to keep the app working if the backend endpoint is down
    return [
      { id: 1, name: 'Indore', state: 'Madhya Pradesh' },
      { id: 2, name: 'Bhopal', state: 'Madhya Pradesh' },
      { id: 3, name: 'Vidisha', state: 'Madhya Pradesh' }
    ];
  }
};

export const getZones = async (cityId) => {
  try {
    const response = await axiosInstance.get(`/api/locations/zones/${cityId}`);
    return response.data;
  } catch (error) {
    console.warn(`Backend zones API failed for cityId ${cityId}, using comprehensive fallback zones`, error);
    
    const id = Number(cityId);

    const zoneFallbacks = {
      1: [ // Indore (22 Zones)
        { id: 101, zoneName: 'Zone 1: Rajwada', cityId: 1 },
        { id: 102, zoneName: 'Zone 2: Annapurna', cityId: 1 },
        { id: 103, zoneName: 'Zone 3: Chandragupta', cityId: 1 },
        { id: 104, zoneName: 'Zone 4: Maharana Pratap', cityId: 1 },
        { id: 105, zoneName: 'Zone 5: Lal Bahadur Shastri', cityId: 1 },
        { id: 106, zoneName: 'Zone 6: Dr. Hedgewar', cityId: 1 },
        { id: 107, zoneName: 'Zone 7: Shaheed Bhagat Singh', cityId: 1 },
        { id: 108, zoneName: 'Zone 8: Subhash Chandra Bose', cityId: 1 },
        { id: 109, zoneName: 'Zone 9: Sant Kanwar Ram', cityId: 1 },
        { id: 110, zoneName: 'Zone 10: Kabir', cityId: 1 },
        { id: 111, zoneName: 'Zone 11: Vivekanand', cityId: 1 },
        { id: 112, zoneName: 'Zone 12: Rani Ahilya', cityId: 1 },
        { id: 113, zoneName: 'Zone 13: Shankar Shah', cityId: 1 },
        { id: 114, zoneName: 'Zone 14: Atal Bihari Vajpayee', cityId: 1 },
        { id: 115, zoneName: 'Zone 15: Guru Govind Singh', cityId: 1 },
        { id: 116, zoneName: 'Zone 16: Pt. Deendayal Upadhyay', cityId: 1 },
        { id: 117, zoneName: 'Zone 17: Ravindra Nath Tagore', cityId: 1 },
        { id: 118, zoneName: 'Zone 18: Sant Jalaram', cityId: 1 },
        { id: 119, zoneName: 'Zone 19: Vinayak Savarkar', cityId: 1 },
        { id: 120, zoneName: 'Zone 20: Sukhliya', cityId: 1 },
        { id: 121, zoneName: 'Zone 21: Musakhedi', cityId: 1 },
        { id: 122, zoneName: 'Zone 22: Azad Nagar', cityId: 1 }
      ],
      2: [ // Bhopal (21 Zones)
        { id: 201, zoneName: 'Zone 1: Old City', cityId: 2 },
        { id: 202, zoneName: 'Zone 2: Bairagarh', cityId: 2 },
        { id: 203, zoneName: 'Zone 3: Shahjahanabad', cityId: 2 },
        { id: 204, zoneName: 'Zone 4: Jahangirabad', cityId: 2 },
        { id: 205, zoneName: 'Zone 5: MP Nagar', cityId: 2 },
        { id: 206, zoneName: 'Zone 6: Arera Colony', cityId: 2 },
        { id: 207, zoneName: 'Zone 7: Gulmohar', cityId: 2 },
        { id: 208, zoneName: 'Zone 8: Kolar Road', cityId: 2 },
        { id: 209, zoneName: 'Zone 9: Misrod', cityId: 2 },
        { id: 210, zoneName: 'Zone 10: Piplani', cityId: 2 },
        { id: 211, zoneName: 'Zone 11: Govindpura', cityId: 2 },
        { id: 212, zoneName: 'Zone 12: Ayodhya Nagar', cityId: 2 },
        { id: 213, zoneName: 'Zone 13: Karond', cityId: 2 },
        { id: 214, zoneName: 'Zone 14: Berasia Road', cityId: 2 },
        { id: 215, zoneName: 'Zone 15: Jawahar Chowk', cityId: 2 },
        { id: 216, zoneName: 'Habibganj Area', cityId: 2 },
        { id: 217, zoneName: 'Katara Hills', cityId: 2 },
        { id: 218, zoneName: 'Bawadiya Kalan', cityId: 2 },
        { id: 219, zoneName: 'Gandhinagar', cityId: 2 },
        { id: 220, zoneName: 'Huzur Area', cityId: 2 },
        { id: 221, zoneName: 'Misrod Extension', cityId: 2 }
      ],
      3: [ // Vidisha
        { id: 301, zoneName: 'Station Road', cityId: 3 },
        { id: 302, zoneName: 'Puran Bazar', cityId: 3 },
        { id: 303, zoneName: 'Sherpura', cityId: 3 },
        { id: 304, zoneName: 'Tilak Ganj', cityId: 3 },
        { id: 305, zoneName: 'Main Road', cityId: 3 },
        { id: 306, zoneName: 'Baripura', cityId: 3 },
        { id: 307, zoneName: 'Durga Nagar', cityId: 3 },
        { id: 308, zoneName: 'Madhav Ganj', cityId: 3 },
        { id: 309, zoneName: 'Civil Lines', cityId: 3 },
        { id: 310, zoneName: 'Sironj Road', cityId: 3 }
      ]
    };

    return zoneFallbacks[id] || [
      { id: 999, zoneName: 'Default Area', cityId: id }
    ];
  }
};
