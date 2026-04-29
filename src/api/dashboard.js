import axiosInstance from './axiosInstance';

export const getSummary = async (cityId) => {
  try {
    const response = await axiosInstance.get(`/api/dashboard/summary/${cityId}`);
    return response.data;
  } catch (error) {
    console.warn(`Dashboard summary API failed for cityId ${cityId}`, error);
    // ─── FALLBACK DATA (commented out to test live backend) ───
    // return {
    //   total: 0,
    //   completed: 0,
    //   inProgress: 0,
    //   pending: 0,
    //   high: 0,
    //   medium: 0,
    //   low: 0,
    // };
    // ─── END FALLBACK ───
    throw error;
  }
};

export const getDashboardZones = async (cityId) => {
  try {
    const response = await axiosInstance.get(`/api/dashboard/zones/${cityId}`);
    return response.data;
  } catch (error) {
    console.warn(`Dashboard zones API failed for cityId ${cityId}`, error);
    
    // ─── FALLBACK DATA (commented out to test live backend) ───
    // const id = Number(cityId);
    // const cityName = id === 1 ? 'Indore' : id === 2 ? 'Bhopal' : id === 3 ? 'Vidisha' : 'Unknown';
    // const zoneFallbacks = {
    //   1: [ // Indore (Full 22 Zones)
    //     { zoneName: 'Zone 1: Rajwada', city: 'Indore', totalPotholes: 12, pending: 5, inProgress: 4, completed: 3, contact: '0731-2410120' },
    //     { zoneName: 'Zone 2: Annapurna', city: 'Indore', totalPotholes: 8, pending: 2, inProgress: 3, completed: 3, contact: '0731-2410512' },
    //     { zoneName: 'Zone 3: Chandragupta', city: 'Indore', totalPotholes: 15, pending: 7, inProgress: 5, completed: 3, contact: '7440440068' },
    //     { zoneName: 'Zone 4: Maharana Pratap', city: 'Indore', totalPotholes: 10, pending: 4, inProgress: 3, completed: 3, contact: '0731-2411000' },
    //     { zoneName: 'Zone 5: Lal Bahadur Shastri', city: 'Indore', totalPotholes: 5, pending: 1, inProgress: 2, completed: 2, contact: '0731-2412000' },
    //     { zoneName: 'Zone 6: Dr. Hedgewar', city: 'Indore', totalPotholes: 20, pending: 10, inProgress: 5, completed: 5, contact: '0731-2413000' },
    //     { zoneName: 'Zone 7: Shaheed Bhagat Singh', city: 'Indore', totalPotholes: 7, pending: 2, inProgress: 2, completed: 3, contact: '0731-2414000' },
    //     { zoneName: 'Zone 8: Subhash Chandra Bose', city: 'Indore', totalPotholes: 11, pending: 3, inProgress: 4, completed: 4, contact: '0731-2415000' },
    //     { zoneName: 'Zone 9: Sant Kanwar Ram', city: 'Indore', totalPotholes: 9, pending: 3, inProgress: 3, completed: 3, contact: '0731-2416000' },
    //     { zoneName: 'Zone 10: Kabir', city: 'Indore', totalPotholes: 14, pending: 6, inProgress: 4, completed: 4, contact: '0731-2417000' },
    //     { zoneName: 'Zone 11: Vivekanand', city: 'Indore', totalPotholes: 6, pending: 2, inProgress: 2, completed: 2, contact: '0731-2418000' },
    //     { zoneName: 'Zone 12: Rani Ahilya', city: 'Indore', totalPotholes: 13, pending: 5, inProgress: 4, completed: 4, contact: '0731-2419000' },
    //     { zoneName: 'Zone 13: Shankar Shah', city: 'Indore', totalPotholes: 8, pending: 2, inProgress: 3, completed: 3, contact: '0731-2420000' },
    //     { zoneName: 'Zone 14: Atal Bihari Vajpayee', city: 'Indore', totalPotholes: 10, pending: 4, inProgress: 3, completed: 3, contact: '0731-2421000' },
    //     { zoneName: 'Zone 15: Guru Govind Singh', city: 'Indore', totalPotholes: 7, pending: 2, inProgress: 2, completed: 3, contact: '0731-2422000' },
    //     { zoneName: 'Zone 16: Pt. Deendayal Upadhyay', city: 'Indore', totalPotholes: 12, pending: 5, inProgress: 4, completed: 3, contact: '0731-2423000' },
    //     { zoneName: 'Zone 17: Ravindra Nath Tagore', city: 'Indore', totalPotholes: 9, pending: 3, inProgress: 3, completed: 3, contact: '0731-2424000' },
    //     { zoneName: 'Zone 18: Sant Jalaram', city: 'Indore', totalPotholes: 11, pending: 4, inProgress: 4, completed: 3, contact: '0731-2425000' },
    //     { zoneName: 'Zone 19: Vinayak Savarkar', city: 'Indore', totalPotholes: 5, pending: 1, inProgress: 2, completed: 2, contact: '0731-2426000' },
    //     { zoneName: 'Zone 20: Sukhliya', city: 'Indore', totalPotholes: 15, pending: 6, inProgress: 5, completed: 4, contact: '0731-2427000' },
    //     { zoneName: 'Zone 21: Musakhedi', city: 'Indore', totalPotholes: 10, pending: 4, inProgress: 3, completed: 3, contact: '0731-2428000' },
    //     { zoneName: 'Zone 22: Azad Nagar', city: 'Indore', totalPotholes: 8, pending: 2, inProgress: 3, completed: 3, contact: '0731-2429000' }
    //   ],
    //   2: [ // Bhopal (Full 21 Zones)
    //     { zoneName: 'Zone 1: Old City', city: 'Bhopal', totalPotholes: 10, pending: 4, inProgress: 3, completed: 3, contact: '0755-1234567' },
    //     { zoneName: 'Zone 2: Bairagarh', city: 'Bhopal', totalPotholes: 6, pending: 2, inProgress: 2, completed: 2, contact: '0755-7654321' },
    //     { zoneName: 'Zone 3: Shahjahanabad', city: 'Bhopal', totalPotholes: 12, pending: 5, inProgress: 4, completed: 3, contact: '0755-2233445' },
    //     { zoneName: 'Zone 4: Jahangirabad', city: 'Bhopal', totalPotholes: 15, pending: 7, inProgress: 5, completed: 3, contact: '0755-3344556' },
    //     { zoneName: 'Zone 5: MP Nagar', city: 'Bhopal', totalPotholes: 20, pending: 8, inProgress: 6, completed: 6, contact: '0755-4455667' },
    //     { zoneName: 'Zone 6: Arera Colony', city: 'Bhopal', totalPotholes: 8, pending: 2, inProgress: 3, completed: 3, contact: '0755-5566778' },
    //     { zoneName: 'Zone 7: Gulmohar', city: 'Bhopal', totalPotholes: 11, pending: 3, inProgress: 4, completed: 4, contact: '0755-6677889' },
    //     { zoneName: 'Zone 8: Kolar Road', city: 'Bhopal', totalPotholes: 18, pending: 9, inProgress: 5, completed: 4, contact: '0755-7788990' },
    //     { zoneName: 'Zone 9: Misrod', city: 'Bhopal', totalPotholes: 14, pending: 6, inProgress: 4, completed: 4, contact: '0755-8899001' },
    //     { zoneName: 'Zone 10: Piplani', city: 'Bhopal', totalPotholes: 9, pending: 3, inProgress: 3, completed: 3, contact: '0755-9900112' },
    //     { zoneName: 'Zone 11: Govindpura', city: 'Bhopal', totalPotholes: 13, pending: 5, inProgress: 4, completed: 4, contact: '0755-0011223' },
    //     { zoneName: 'Zone 12: Ayodhya Nagar', city: 'Bhopal', totalPotholes: 7, pending: 2, inProgress: 2, completed: 3, contact: '0755-1122334' },
    //     { zoneName: 'Zone 13: Karond', city: 'Bhopal', totalPotholes: 10, pending: 4, inProgress: 3, completed: 3, contact: '0755-2233445' },
    //     { zoneName: 'Zone 14: Berasia Road', city: 'Bhopal', totalPotholes: 6, pending: 2, inProgress: 2, completed: 2, contact: '0755-3344556' },
    //     { zoneName: 'Zone 15: Jawahar Chowk', city: 'Bhopal', totalPotholes: 11, pending: 3, inProgress: 4, completed: 4, contact: '0755-4455667' },
    //     { zoneName: 'Habibganj Area', city: 'Bhopal', totalPotholes: 9, pending: 3, inProgress: 3, completed: 3, contact: '0755-5566778' },
    //     { zoneName: 'Katara Hills', city: 'Bhopal', totalPotholes: 8, pending: 2, inProgress: 3, completed: 3, contact: '0755-6677889' },
    //     { zoneName: 'Bawadiya Kalan', city: 'Bhopal', totalPotholes: 10, pending: 4, inProgress: 3, completed: 3, contact: '0755-7788990' },
    //     { zoneName: 'Gandhinagar', city: 'Bhopal', totalPotholes: 7, pending: 2, inProgress: 2, completed: 3, contact: '0755-8899001' },
    //     { zoneName: 'Huzur Area', city: 'Bhopal', totalPotholes: 12, pending: 5, inProgress: 4, completed: 3, contact: '0755-9900112' },
    //     { zoneName: 'Misrod Extension', city: 'Bhopal', totalPotholes: 6, pending: 2, inProgress: 2, completed: 2, contact: '0755-0011223' }
    //   ],
    //   3: [] // Vidisha
    // };
    // return zoneFallbacks[id] || [{ zoneName: 'Default Area', city: cityName, totalPotholes: 0, pending: 0, inProgress: 0, completed: 0, contact: '9999999999' }];
    // ─── END FALLBACK ───
    throw error;
  }
};
