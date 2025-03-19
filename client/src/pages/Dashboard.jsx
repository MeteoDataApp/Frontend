/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { Heading, Button, Tabs, TabList, TabPanels, Tab, TabPanel, Menu, MenuButton, MenuList, MenuItem, Flex, Input, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, IconButton, Checkbox, SimpleGrid, VStack } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useShowToast } from '../extensions/useShowToast';
import server from "../../networking";
import ByStationLineChart from '../components/ByStationLineChart';
import { FiArrowDown, FiArrowLeft, FiArrowUp } from 'react-icons/fi';

const Dashboard = () => {
    const MotionBox = motion.div;

    const showToast = useShowToast();

    const [selectedStation, setSelectedStation] = useState(null);
    const [searchedStationCode, setSearchedStationCode] = useState(null);
    const [selectedStationName, setSelectedStationName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [advancedLoading, setAdvancedLoading] = useState(false);
    const [advancedRenderReady, setAdvancedRenderReady] = useState(false);
    const [data, setData] = useState([]);
    const [sortOrderDate, setSortOrderDate] = useState('desc');
    const [sortOrderAvg, setSortOrderAvg] = useState('desc');
    const [sortOrderFD, setSortOrderFD] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("station");
    const [advancedAnalysisList, setAdvancedAnalysisList] = useState([]);
    const recordsPerPage = activeTab === "station" ? 9 : 7;

    const handleSubmitStation = async () => {
        if (!selectedStation) return;
        setCurrentPage(1);
        setLoading(true);
        setSelectedStationName(stationList.find(s => s.code === selectedStation).name);
        setSearchedStationCode(selectedStation);
        try {
            let query = `station=${selectedStation}`;
            if (startDate) query += `&start=${startDate}`;
            if (endDate) query += `&end=${endDate}`;

            const response = await server.get(`/by_station?${query}`);
            setData(response.data);
            if (response.data.length === 0) {
                showToast("error", "", "Please try another station or date range");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            showToast("error", "", error.response.data.error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitDate = async () => {
        if (!selectedDate) return;
        setCurrentPage(1);
        setLoading(true);
        try {
            const response = await server.get(`/by_date?date=${selectedDate}`);
            setData(response.data);
            setAdvancedRenderReady(true);
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

    const handleAdvancedAnalysis = async () => {
        console.log("Selected station codes for advanced analysis:", advancedAnalysisList);
    };

    const sortDataDate = () => {
        const sorted = [...data].sort((a, b) => {
            const dateA = new Date(a.Date);
            const dateB = new Date(b.Date);
            return sortOrderDate === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setData(sorted);
        setSortOrderDate(sortOrderDate === 'asc' ? 'desc' : 'asc');
        setSortOrderAvg('desc');
        setSortOrderFD('desc');
    };

    const sortDataAvg = () => {
        const sorted = [...data].sort((a, b) =>
            sortOrderAvg === 'asc' ? a.Avg - b.Avg : b.Avg - a.Avg
        );
        setData(sorted);
        setSortOrderAvg(sortOrderAvg === 'asc' ? 'desc' : 'asc');
        setSortOrderDate('desc');
        setSortOrderFD('desc');
    };

    const sortDataFD = () => {
        const sorted = [...data].sort((a, b) =>
            sortOrderFD === 'asc' ? a.FDAvg - b.FDAvg : b.FDAvg - a.FDAvg
        );
        setData(sorted);
        setSortOrderFD(sortOrderFD === 'asc' ? 'desc' : 'asc');
        setSortOrderDate('desc');
        setSortOrderAvg('desc');
    };

    const handleCheckboxChange = (e, stationCode) => {
        if (e.target.checked) {
            setAdvancedAnalysisList((prev) => {
                if (!prev.includes(stationCode) && prev.length < 3) {
                    return [...prev, stationCode];
                }
                return prev;
            });
        } else {
            setAdvancedAnalysisList((prev) => prev.filter(code => code !== stationCode));
        }
    };

    const stationList = [
        { code: 58349, name: "苏州", image: "Suzhou.jpg" },
        { code: 58238, name: "南京", image: "Nanjing.jpg" },
        { code: 58354, name: "无锡", image: "Wuxi.jpg" },
        { code: 58343, name: "常州", image: "Changzhou.jpg" },
        { code: 58252, name: "镇江", image: "Zhenjiang.jpg" },
        { code: 58259, name: "南通", image: "Nantong.jpg" },
        { code: 58246, name: "泰州", image: "Taizhou.jpg" },
        { code: 58245, name: "扬州", image: "Yangzhou.jpg" },
        { code: 58027, name: "徐州", image: "Xuzhou.jpg" },
        { code: 58044, name: "连云港", image: "Lianyungang.jpg" },
        { code: 58141, name: "淮安", image: "Huaian.jpg" },
        { code: 58154, name: "盐城", image: "Yancheng.jpg" },
        { code: 58131, name: "宿迁", image: "Suqian.jpg" },
    ];

    const paginateData = (data) => {
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(data.length / recordsPerPage);
    const displayedData = paginateData(data);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const currentStartDate = displayedData[0]?.Date;
    const currentEndDate = displayedData[displayedData.length - 1]?.Date;

    return (
        <MotionBox
            display="flex"
            flexDirection="column"
            minH="100vh"
            bgGradient="linear(to-br, #f0f4ff 0%, #f8fafc 100%)"
            py={16}
            px={4}
        >
            <Box flex="1">
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
                        mt={24}
                    >
                        Weather Dashboard
                    </Heading>
                </MotionBox>

                <MotionBox
                    display="flex"
                    justifyContent="center"
                    mx="auto"
                    mb={20}
                >
                    <Tabs variant='soft-rounded' colorScheme='green'>
                        <TabList display="flex" justifyContent="center" mt={10} mb={5}>
                            <Tab
                                onClick={() => {
                                    setCurrentPage(1);
                                    setActiveTab("station");
                                    setStartDate(startDate);
                                    setEndDate(endDate);
                                    setData([]);
                                    setAdvancedRenderReady(false);
                                }}
                                _selected={{
                                    bgGradient: "linear(to-r, #6366f1, #ec4899)",
                                    color: "white",
                                    boxShadow: "md",
                                }}
                                _hover={{ transform: "scale(1.05)" }}
                                _active={{ transform: "scale(0.95)" }}
                                mx={2}
                                px={6}
                                py={2}
                                borderRadius="full"
                                transition="all 0.2s"
                            >
                                Search By Station
                            </Tab>
                            <Tab
                                onClick={() => {
                                    setCurrentPage(1);
                                    setActiveTab("date");
                                    setData([]);
                                }}
                                _selected={{
                                    bgGradient: "linear(to-r, #6366f1, #ec4899)",
                                    color: "white",
                                    boxShadow: "md",
                                }}
                                _hover={{ transform: "scale(1.05)" }}
                                _active={{ transform: "scale(0.95)" }}
                                mx={2}
                                px={6}
                                py={2}
                                borderRadius="full"
                                transition="all 0.2s"
                            >
                                Search By Date
                            </Tab>
                        </TabList>
                        <TabPanels mb={4}>
                            <TabPanel>
                                <Flex gap={3} align="center" justifyContent="center">
                                    {/* Station Selection Dropdown */}
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

                                    {/* Start Date Input Field */}
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        size="md"
                                        borderRadius="md"
                                        maxW="200px"
                                        max="2025-03-09"
                                    />

                                    {/* End Date Input Field */}
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        size="md"
                                        borderRadius="md"
                                        maxW="200px"
                                        max="2025-03-09"
                                    />

                                    {/* Search Button */}
                                    <Button
                                        onClick={handleSubmitStation}
                                        bgGradient="linear(to-r, #6366f1, #ec4899)"
                                        color="white"
                                        _hover={selectedStation && {
                                            bgGradient: "linear(to-r, #6366f1, #ec4899)",
                                            transform: "scale(1.05)",
                                            boxShadow: "lg",
                                        }}
                                        _active={selectedStation && {
                                            bgGradient: "linear(to-r, #6366f1, #ec4899)",
                                            transform: "scale(0.95)",
                                        }}
                                        isLoading={loading}
                                        isDisabled={!selectedStation}
                                    >
                                        Search
                                    </Button>
                                </Flex>
                            </TabPanel>
                            <TabPanel>
                                <Flex gap={3} align="center" justifyContent="center">
                                    <Input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        size="md"
                                        borderRadius="md"
                                        maxW="200px"
                                    />

                                    <Button
                                        onClick={handleSubmitDate}
                                        bgGradient="linear(to-r, #6366f1, #ec4899)"
                                        color="white"
                                        _hover={{
                                            bgGradient: "linear(to-r, #6366f1, #ec4899)",
                                            transform: "scale(1.05)",
                                            boxShadow: "lg",
                                        }}
                                        _active={{
                                            bgGradient: "linear(to-r, #6366f1, #ec4899)",
                                            transform: "scale(0.95)",
                                        }}
                                        isLoading={loading}
                                    >
                                        Search
                                    </Button>

                                    {data.length > 0 && advancedRenderReady === true && (
                                        <Button
                                            onClick={handleAdvancedAnalysis}
                                            bgGradient="linear(to-r, #6366f1, #ec4899)"
                                            color="white"
                                            _hover={advancedAnalysisList.length >= 2 && advancedAnalysisList.length < 3 && {
                                                bgGradient: "linear(to-r, #6366f1, #ec4899)",
                                                transform: "scale(1.05)",
                                                boxShadow: "lg",
                                            }}
                                            _active={advancedAnalysisList.length >= 2 && advancedAnalysisList.length < 3 && {
                                                bgGradient: "linear(to-r, #6366f1, #ec4899)",
                                                transform: "scale(0.95)",
                                            }}
                                            isLoading={advancedLoading}
                                            isDisabled={advancedAnalysisList.length < 2}
                                        >
                                            Advanced Analysis
                                        </Button>
                                    )}
                                </Flex>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </MotionBox>

                {displayedData.length > 0 && activeTab === "date" && (
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
                                        <Th>
                                            {activeTab === "station" && (
                                                <Box
                                                    as="span"
                                                    cursor="pointer"
                                                    onClick={sortDataDate}
                                                >
                                                    Date {sortOrderDate === 'asc' ? ' ↑' : ' ↓'}
                                                </Box>
                                            )}
                                            {activeTab !== "station" && "Date"}
                                        </Th>
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
                                    {displayedData.map((record) => {
                                        const stationInfo = stationList.find(s => s.code === record.Station);
                                        return (
                                            <Tr key={record._id}>
                                                <Td>
                                                    <Box display="flex" gap={3}>
                                                        {activeTab === "date" && (
                                                            <Checkbox
                                                                isChecked={advancedAnalysisList.includes(record.Station)}
                                                                isDisabled={
                                                                    !advancedAnalysisList.includes(record.Station) &&
                                                                    advancedAnalysisList.length >= 3
                                                                }
                                                                onChange={(e) => handleCheckboxChange(e, record.Station)}
                                                                borderColor={"gray.400"}
                                                            />
                                                        )}

                                                        {stationInfo ? `${stationInfo.name} (${record.Station})` : record.Station}
                                                    </Box>
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

                {displayedData.length > 0 && activeTab === "station" && (
                    <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        mx="auto"
                    >
                        <Box
                            alignItems="center"
                            w="95%"
                            margin="auto"
                            minH="52rem"
                            position="relative"
                            overflow="hidden"
                            sx={{
                                perspective: '1000px',
                                transformStyle: 'preserve-3d',
                            }}
                            borderRadius={50}
                        >
                            {/* Background */}
                            <Box
                                position="fixed"
                                top={0}
                                left={0}
                                w="100%"
                                h="100%"
                                backgroundImage={stationList.find(s => s.code === searchedStationCode)?.image}
                                backgroundSize="cover"
                                backgroundPosition="center"
                                transform="translateZ(-1px) scale(1.2)"
                                filter="auto blur(3px) brightness(0.5)"
                                sx={{
                                    willChange: 'transform',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.2) 0%, rgba(99, 102, 241, 0.3) 100%)',
                                    }
                                }}
                            />

                            {/* Title */}
                            <Box
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                textAlign="center"
                                position="relative"
                                zIndex={1}
                                mb={4}
                                mt={2}
                            >
                                <Text
                                    fontSize={{ base: '6xl', md: '8xl' }}
                                    fontWeight="black"
                                    sx={{
                                        fontFamily: 'var(--font-calligraphy)',
                                        background: 'linear-gradient(45deg, #fff 20%,white 80%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textShadow: '4px 4px 8px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    {selectedStationName ? selectedStationName : "Station"}
                                </Text>
                            </Box>

                            {/* Sorting Controls */}
                            <MotionBox
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                maxW="1400px"
                                mx="auto"
                                mt={8}
                                px={4}
                                display="flex"
                                gap={4}
                                justifyContent="center"
                            >
                                {['date', 'avg', 'FD'].map((sortType) => {
                                    const sortOrder = {
                                        date: sortOrderDate,
                                        avg: sortOrderAvg,
                                        FD: sortOrderFD
                                    }[sortType];

                                    return (
                                        <Button
                                            key={sortType}
                                            rightIcon={sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
                                            onClick={
                                                sortType === 'date' ? sortDataDate :
                                                    sortType === 'avg' ? sortDataAvg :
                                                        sortDataFD
                                            }
                                            variant="solid"
                                            bgGradient={sortOrder === 'asc'
                                                ? "linear(to-r, #6366f1, #ec4899)"
                                                : "linear(to-r, #ec4899, #6366f1)"}
                                            color="white"
                                            _hover={{
                                                bgGradient: sortOrder === 'asc'
                                                    ? "linear(to-r, #4f46e5, #db2777)"
                                                    : "linear(to-r, #db2777, #4f46e5)",
                                                transform: "scale(1.05)"
                                            }}
                                            _active={{ transform: "scale(0.95)" }}
                                            px={6}
                                            borderRadius={10}
                                            mx={2}
                                            boxShadow="xl"
                                        >
                                            {`Sort by ${{
                                                date: 'Date',
                                                avg: 'Temperature',
                                                FD: '5-Day Avg'
                                            }[sortType]}`}
                                        </Button>
                                    )
                                })}
                            </MotionBox>

                            {/* Weather Cards */}
                            <SimpleGrid
                                columns={{ base: 1, md: 3 }}
                                spacing={6}
                                maxW="1400px"
                                mx="auto"
                                mt={12}
                                px={4}
                                position="relative"
                                zIndex={1}
                            >
                                {displayedData.map((record) => (
                                    <MotionBox
                                        key={record._id}
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        whileHover={{ y: -10 }}
                                        transition={{ type: 'spring', stiffness: 200 }}
                                        position="relative"
                                    >
                                        <Box
                                            bg="rgba(255, 255, 255, 0.8)"
                                            border="1px solid"
                                            borderColor="whiteAlpha.700"
                                            borderRadius="2xl"
                                            p={6}
                                            boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.3)"
                                            position="relative"
                                            overflow="hidden"
                                            _before={{
                                                content: '""',
                                                position: 'absolute',
                                                top: '-50%',
                                                left: '-50%',
                                                w: '200%',
                                                h: '200%',
                                                bg: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
                                                transform: 'rotate(45deg)',
                                                animation: 'shine 6s infinite',
                                            }}
                                        >
                                            <VStack spacing={4} align="stretch">
                                                {/* Date Header */}
                                                <Flex justify="space-between" align="center">
                                                    <Box
                                                        bgGradient="linear(to-r, #6366f1, #ec4899)"
                                                        px={4}
                                                        py={1}
                                                        borderRadius={10}
                                                    >
                                                        <Text fontSize="sm" fontWeight="bold" color="white">
                                                            {record.Date}
                                                        </Text>
                                                    </Box>
                                                </Flex>

                                                {/* Temperature Section */}
                                                <Box position="relative" >
                                                    <Flex align="center" justify="space-between">
                                                        <Box>
                                                            <Text
                                                                fontSize="4xl"
                                                                fontWeight="black"
                                                                color="gray.800"
                                                                lineHeight="1"
                                                            >
                                                                {record.Avg}°C
                                                            </Text>
                                                            <Text fontSize="sm" color="gray.600" mt={1}>
                                                                Average Temperature
                                                            </Text>
                                                        </Box>
                                                        <Box textAlign="right">
                                                            <Text
                                                                display="inline-flex"
                                                                alignItems="center"
                                                                fontSize="2xl"
                                                                fontWeight="bold"
                                                                gap={1}
                                                                color={record.FDAvg > record.Avg ? 'red.600' : record.FDAvg === record.Avg ? "green.600" : 'blue.600'}
                                                            >
                                                                {record.FDAvg}°C
                                                                <Box as="span" display="inline-block" mt="2px">
                                                                    {record.FDAvg > record.Avg ? (
                                                                        <FiArrowUp />
                                                                    ) : record.FDAvg === record.Avg ? (
                                                                        <FiArrowLeft />
                                                                    ) : (
                                                                        <FiArrowDown />
                                                                    )}
                                                                </Box>
                                                            </Text>
                                                            <Text fontSize="sm" color="gray.600">
                                                                5-Day Average
                                                            </Text>
                                                        </Box>
                                                    </Flex>
                                                </Box>
                                            </VStack>
                                        </Box>
                                    </MotionBox>
                                ))}
                            </SimpleGrid>
                        </Box>

                        {/* Weather Data Trend Chart */}
                        {data.length > 0 && (
                            <MotionBox
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                mx="auto"
                                maxW="1200px"
                                mt={8}
                                bg="white"
                                borderRadius="xl"
                                boxShadow="xl"
                                p={6}
                                textAlign="center"
                                mb={16}
                                transition={{ duration: 0.5 }}
                            >
                                <Heading size="md" mb={4} bgGradient="linear(to-r, #6366f1, #ec4899)" bgClip="text" fontSize={{ base: '3xl', md: '4xl' }} mt={14}>
                                    Weather Data Trend in {selectedStationName ? selectedStationName : "Station"}
                                </Heading>
                                <Box h="50vh" w="90vw" mb={32} alignItems="center" justifyContent="center" mx="auto">
                                    <ByStationLineChart
                                        data={data}
                                        xAxisKey="Date"
                                        yAxisKeys={["Avg", "FDAvg"]}
                                        currentStartDate={currentStartDate}
                                        currentEndDate={currentEndDate}
                                        selectedStationName={selectedStationName}
                                    />
                                </Box>
                            </MotionBox>
                        )}
                    </MotionBox>
                )}
            </Box>

            <Box
                as="footer"
                position="fixed"
                bottom="0"
                left="0"
                width="100%"
                bg="white"
                textAlign="left"
                py={4}
                borderTop="1px solid #e2e8f0"
                borderColor="purple.100"
                zIndex="docked"
                display="flex"
                justifyContent="space-between"
                px={4}
            >
                <Text fontSize="sm" color="gray.600" alignContent={{ base: 'center', md: 'left' }} p={3}>
                    Data is only available from 1 January 2018 until 9 March 2025.
                </Text>
                {data.length > 0 && (
                    <Flex align="center">
                        <Text fontSize="sm" color="gray.600">
                            Showing {((currentPage - 1) * recordsPerPage) + 1} - {Math.min(currentPage * recordsPerPage, data.length)} of {data.length} {data.length === 1 ? "record" : "records"}
                        </Text>

                        <IconButton
                            padding={0}
                            variant={'ghost'}
                            color={currentPage === 1 ? 'gray.400' : '#4F46E5'}
                            _hover={{ bg: 'none' }}
                            icon={<ChevronLeftIcon />}
                            onClick={handlePrevPage}
                            isDisabled={currentPage === 1}
                            aria-label="Previous Page"
                            mx={2}
                            fontSize="2xl"
                        />

                        <IconButton
                            padding={0}
                            variant={'ghost'}
                            color={currentPage === totalPages ? 'gray.400' : '#4F46E5'}
                            _hover={{ bg: 'none' }}
                            icon={<ChevronRightIcon />}
                            onClick={handleNextPage}
                            isDisabled={currentPage === totalPages}
                            aria-label="Next Page"
                            mx={2}
                            fontSize="2xl"
                        />
                    </Flex>
                )}
            </Box>
        </MotionBox>
    );
};

export default Dashboard;