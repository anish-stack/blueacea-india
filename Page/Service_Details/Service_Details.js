import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    Image,
    RefreshControl
} from 'react-native';
import Layout from '../../components/Layout/_layout';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchAllServiceData, ServiceByName } from '../../utils/api/Api';
import RCard from './RCard';
import Promise from './Promise';
import Button from '../../components/common/Button';

const { width } = Dimensions.get('window');

export default function Service_Details() {
    const route = useRoute();
    const { id } = route.params || {};
    const [data, setData] = useState({});
    const [relatedData, setRelatedData] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedServiceId, setSelectedServiceId] = useState(null);

    const navigation = useNavigation()
    const fetchData = async () => {
        if (!id) {
            return alert('Invalid Service ID');
        }
        try {
            const response = await ServiceByName(id);
            // console.log("response from your service", response)
            setData(response || {});
        } catch (error) {
            console.error(error);
        }
    };

    const fetchRelatedData = async () => {
        try {
            const response = await fetchAllServiceData(id);
            setRelatedData(response || []);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleSelection = (name,id) => {
        console.log(id)
        setSelectedService(prevSelected => prevSelected === name ? null : name);
        setSelectedServiceId(prevSelected => prevSelected === id ? null : id);
    }


    useEffect(() => {
        fetchData();
        fetchRelatedData();
    }, [id]);

    return (
        <Layout isHeaderWithBackShown={true} title={id} isHeaderShown={false}>
            <ScrollView

                showsVerticalScrollIndicator={false}
            >
                {/* Banner Section */}
                <View style={styles.bannerContainer}>
                    <Image
                        source={{
                            uri: data?.sliderImage?.[0]?.url || 'https://placehold.co/600x400?text=No+Image'
                        }}
                        style={styles.bannerImage}
                        resizeMode="contain"
                    />
                    <View style={styles.bannerOverlay}>
                        <Text style={styles.bannerTitle}>{data?.metaTitle}</Text>
                    </View>
                </View>
                <Promise />



                <View style={styles.relatedSection}>
                    <Text style={styles.sectionTitle}>{id} Related Services</Text>
                    <View style={styles.cardsContainer}>
                        {relatedData && relatedData.length > 0 ? (
                            relatedData.map((item, index) => (
                                <RCard
                                    key={index}
                                    data={{
                                        ...item,
                                        isSelected: item.name === selectedService,
                                        duration: '1 hour',
                                        location: 'Main Branch'
                                    }}
                                    onPress={() => toggleSelection(item.name,item._id)}
                                />
                            ))
                        ) : (
                            <Text style={styles.noDataText}>No related services found</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
            {selectedService && (
                <Button onPress={() => navigation.navigate('Booking', { serviceType: selectedService, serviceId: data?._id,selectedServiceId:selectedServiceId })} variant='secondary'>
                    Book Now
                </Button>
            )}
        </Layout>
    );
}

const styles = StyleSheet.create({
    bannerContainer: {
        width: '100%',
        marginBottom: 12,
        height: 135,
        position: 'relative',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    bannerOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
    },
    bannerTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    infoSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginTop: 16,
        borderRadius: 16,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    relatedSection: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 16,
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    noDataText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        width: '100%',
        marginTop: 24,
    },
});