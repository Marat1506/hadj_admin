'use client';

import * as React from 'react';



import { navigationApi } from '@/lib/navigation-api';





interface CityItem {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface ServiceItem {
  id: number;
  cityId: number;
  title: string;
  description?: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface ObjectItem {
  id: number;
  serviceId: number;
  title: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

interface AddressItem {
  id: number;
  objectId: number;
  title: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateCityData {
  name: string;
}

interface UpdateCityData {
  name?: string;
}

interface CreateServiceData {
  cityId: number;
  title: string;
  description?: string;
  type: string;
}

interface UpdateServiceData {
  title?: string;
  description?: string;
  type?: string;
  cityId?: number;
}

interface CreateObjectData {
  serviceId: number;
  title: string;
  latitude?: number;
  longitude?: number;
}

interface UpdateObjectData {
  title?: string;
  latitude?: number;
  longitude?: number;
  serviceId?: number;
}

interface CreateAddressData {
  objectId: number;
  title: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
}

interface UpdateAddressData {
  title?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  objectId?: number;
}

export function useNavigation() {
  const [cities, setCities] = React.useState<CityItem[]>([]);
  const [services, setServices] = React.useState<ServiceItem[]>([]);
  const [objects, setObjects] = React.useState<ObjectItem[]>([]);
  const [addresses, setAddresses] = React.useState<AddressItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchAll = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [citiesData, addressesData] = await Promise.all([
        navigationApi.getCities(),
        navigationApi.getAddresses(),
      ]);
      setCities(citiesData);
      setAddresses(addressesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch navigation data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getServicesByCity = React.useCallback(async (cityId: number | string) => {
		setIsLoading(true);
		try {
			const servicesData = await navigationApi.getServicesByCity(cityId);
			setServices((prev) => {
				const otherServices = prev.filter((s) => s.cityId !== parseInt(cityId.toString()));
				return [...otherServices, ...servicesData];
			});
			return servicesData;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch services");
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

  const getServicesById = React.useCallback(async (id: number | string) => {
    setIsLoading(true);
    try {
      const servicesData = await navigationApi.getServicesById(id);
      setServices((prev) => {
        return servicesData;
      });
      return servicesData;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch services");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getObjectByServices = React.useCallback(async (serviceId: number | string) => {
    setIsLoading(true);
    try {
      const servicesData = await navigationApi.getObjectsByService(serviceId);
      setObjects((prev) => {
        const otherObject = prev.filter((s) => s.serviceId !== parseInt(serviceId.toString()));
        return [...otherObject, ...otherObject];
      });
      return servicesData;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch services");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // City operations
  const createCity = React.useCallback(async (data: CreateCityData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newCity = await navigationApi.createCity(data);
      setCities(prev => [...prev, newCity]);
      return newCity;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create city');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCity = React.useCallback(async (id: number, data: UpdateCityData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCity = await navigationApi.updateCity(id, data);
      setCities(prev => prev.map(city => city.id === id ? updatedCity : city));
      return updatedCity;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update city');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCity = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await navigationApi.deleteCity(id);
      setCities(prev => prev.filter(city => city.id !== id));
      // Also delete related services, objects, and addresses
      setServices(prev => prev.filter(service => service.cityId !== id));
      setObjects(prev => prev.filter(obj => {
        const service = services.find(s => s.id === obj.serviceId);
        return service && service.cityId !== id;
      }));
      setAddresses(prev => prev.filter(addr => {
        const obj = objects.find(o => o.id === addr.objectId);
        const service = obj ? services.find(s => s.id === obj.serviceId) : null;
        return service && service.cityId !== id;
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete city');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [services, objects]);

  // Service operations
  const createService = React.useCallback(async (data: CreateServiceData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newService = await navigationApi.createService(data);
      setServices(prev => [...prev, newService]);
      return newService;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create service');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateService = React.useCallback(async (id: number, data: UpdateServiceData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedService = await navigationApi.updateService(id, data);
      setServices(prev => prev.map(service => service.id === id ? updatedService : service));
      return updatedService;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update service');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteService = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await navigationApi.deleteService(id);
      setServices(prev => prev.filter(service => service.id !== id));
      // Also delete related objects and addresses
      setObjects(prev => prev.filter(obj => obj.serviceId !== id));
      setAddresses(prev => prev.filter(addr => {
        const obj = objects.find(o => o.id === addr.objectId);
        return obj && obj.serviceId !== id;
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete service');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [objects]);

  // Object operations
  const createObject = React.useCallback(async (data: CreateObjectData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newObject = await navigationApi.createObject(data);
      setObjects(prev => [...prev, newObject]);
      return newObject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create object');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateObject = React.useCallback(async (id: number, data: UpdateObjectData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedObject = await navigationApi.updateObject(id, data);
      setObjects(prev => prev.map(obj => obj.id === id ? updatedObject : obj));
      return updatedObject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update object');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteObject = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await navigationApi.deleteObject(id);
      setObjects(prev => prev.filter(obj => obj.id !== id));
      // Also delete related addresses
      setAddresses(prev => prev.filter(addr => addr.objectId !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete object');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Address operations
  const createAddress = React.useCallback(async (data: CreateAddressData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newAddress = await navigationApi.createAddress(data);
      setAddresses(prev => [...prev, newAddress]);
      return newAddress;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create address');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAddress = React.useCallback(async (id: number, data: UpdateAddressData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedAddress = await navigationApi.updateAddress(id, data);
      setAddresses(prev => prev.map(addr => addr.id === id ? updatedAddress : addr));
      return updatedAddress;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update address');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAddress = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await navigationApi.deleteAddress(id);
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete address');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    cities,
    services,
    objects,
    addresses,
    isLoading,
    error,
    fetchAll,
    getServicesByCity,
    createCity,
    updateCity,
    deleteCity,
    createService,
    updateService,
    deleteService,
    getObjectByServices,
    createObject,
    updateObject,
    deleteObject,
    createAddress,
    updateAddress,
    deleteAddress,
    getServicesById
  };
}
