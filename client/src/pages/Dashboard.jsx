/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { Heading, Button, Tabs, TabList, TabPanels, Tab, TabPanel, Menu, MenuButton, MenuList, MenuItem, Flex, Input, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import server from "../../networking";
import { useShowToast } from '../extensions/useShowToast';

const Dashboard = () => {
    const MotionBox = motion.div;

    const showToast = useShowToast();

    const [selectedStation, setSelectedStation] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [sortOrderAvg, setSortOrderAvg] = useState('desc');
    const [sortOrderFD, setSortOrderFD] = useState('desc');

    const handleSubmitStation = async () => {
        if (!selectedStation) return;
        setLoading(true);
        try {
            const response = await server.get(`/by_station?station=${selectedStation}`);
            setData(response.data);
            if (response.data.length === 0) {
                showToast("error", "No data found", "Please try another station");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitDate = async () => {
        if (!selectedDate) return;
        setLoading(true);
        try {
            const response = await server.get(`/by_date?date=${selectedDate}`);
            setData(response.data);
            if (response.data.length === 0) {
                showToast("error", "No data found", "Please try another date");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const sortDataAvg = () => {
        const sorted = [...data].sort((a, b) => 
            sortOrderAvg === 'asc' ? a.Avg - b.Avg : b.Avg - a.Avg
        );
        setData(sorted);
        setSortOrderAvg(sortOrderAvg === 'asc' ? 'desc' : 'asc');
    };

    const sortDataFD = () => {
        const sorted = [...data].sort((a, b) => 
            sortOrderFD === 'asc' ? a.FDAvg - b.FDAvg : b.FDAvg - a.FDAvg
        );
        setData(sorted);
        setSortOrderFD(sortOrderFD === 'asc' ? 'desc' : 'asc');
    };

    const stationList = [
        { code: 58349, name: "苏州" },
        { code: 58238, name: "南京" },
        { code: 58354, name: "无锡" },
        { code: 58343, name: "常州" },
        { code: 58252, name: "镇江" },
        { code: 58259, name: "南通" },
        { code: 58246, name: "泰州" },
        { code: 58245, name: "扬州" },
        { code: 58027, name: "徐州" },
        { code: 58044, name: "连云港" },
        { code: 58141, name: "淮安" },
        { code: 58154, name: "盐城" },
        { code: 58131, name: "宿迁" },
    ];

    return (
        <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            bgGradient="linear(to-br, #f0f4ff 0%, #f8fafc 100%)"
            minH="100vh"
            py={16}
            px={4}
        >
            <MotionBox
                textAlign="center"
                mb={16}
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Heading
                    bgGradient="linear(to-r, #6366f1, #ec4899)"
                    bgClip="text"
                    fontSize={{ base: '3xl', md: '4xl' }}
                    mb={3}
                    mt={3}
                >
                    Weather Dashboard
                </Heading>
            </MotionBox>

            <MotionBox
                display="flex"
                justifyContent={"center"}
                mx="auto"
                mb={20}
            >
                <Tabs variant='soft-rounded' colorScheme='green'>
                    <TabList display="flex" justifyContent="center" mt={10} mb={5}>
                        <Tab>Search By Station</Tab>
                        <Tab>Search By Date</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Menu>
                                <MenuButton 
                                    as={Button} 
                                    rightIcon={<ChevronDownIcon />}
                                >
                                    {selectedStation ? 
                                        `${stationList.find(s => s.code === selectedStation).name} (${selectedStation})` : 
                                        'Select Station'
                                    }
                                </MenuButton>
                                <MenuList maxH="300px" overflowY="auto">
                                    {stationList.map((station) => (
                                        <MenuItem 
                                            key={station.code}
                                            onClick={() => setSelectedStation(station.code)}
                                        >
                                            {`${station.name} (${station.code})`}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>

                            <Button ml={3} onClick={handleSubmitStation} colorScheme='green' isLoading={loading} isDisabled={!selectedStation}>
                                Search
                            </Button>
                        </TabPanel>
                        <TabPanel>
                            <Flex gap={3} align="center" justifyContent={"center"}>
                                <Input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    size="md"
                                    borderRadius="md"
                                    maxW="200px"
                                />
                                <Button
                                    colorScheme="green"
                                    onClick={handleSubmitDate}
                                    isLoading={loading}
                                >
                                    Search
                                </Button>
                            </Flex>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </MotionBox>

            {data.length > 0 && (
                <MotionBox
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    mx="auto"
                    maxW="1200px"
                >
                    <TableContainer bg="white" borderRadius="xl" boxShadow="xl">
                        <Table variant="striped">
                            <Thead>
                                <Tr>
                                    <Th>Station</Th>
                                    <Th>Date</Th>
                                    <Th cursor="pointer" onClick={sortDataAvg}>
                                        Avg Temp (°C) 
                                        {sortOrderAvg === 'asc' ? ' ↑' : ' ↓'}
                                    </Th>
                                    <Th cursor="pointer" onClick={sortDataFD}>
                                        5-day Avg Temp (°C)
                                        {sortOrderFD === 'asc' ? ' ↑' : ' ↓'}
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                            {data.map((record) => {
                                const stationInfo = stationList.find(s => s.code === record.Station);
                                return (
                                    <Tr key={record._id}>
                                        <Td>
                                            {stationInfo ? `${stationInfo.name} (${record.Station})` : record.Station}
                                        </Td>
                                        <Td>{record.Date}</Td>
                                        <Td fontWeight="bold">{record.Avg}</Td>
                                        <Td fontWeight="bold">{record.FDAvg}</Td>
                                    </Tr>
                                );
                            })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </MotionBox>
            )}
        </MotionBox>
    );
};

export default Dashboard;