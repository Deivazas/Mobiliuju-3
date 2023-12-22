// actions.js
export const addAdvertisement = (advertisement) => ({
    type: 'ADD_ADVERTISEMENT',
    payload: advertisement,
  });
  
export const editAdvertisement = (updatedAdvertisement) => ({
    type: 'EDIT_ADVERTISEMENT',
    payload: updatedAdvertisement,
  });
  
export const deleteAdvertisement = (id) => {
    return {
      type: 'DELETE_ADVERTISEMENT',
      payload: {
        id,
      },
    };
  };
  
  