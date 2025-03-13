/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { Box, Heading, Button, Tabs, TabList, TabPanels, Tab, TabPanel, Menu, MenuButton, MenuList, MenuItem, Text } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const Dashboard = () => {
    const MotionBox = motion(Box);

    const handleSubmitStation = async() => {
        console.log("Submit button clicked");
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
                    <TabList>
                        <Tab>Search By Station</Tab>
                        <Tab>Search By Date</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Menu mr={3}>
                                {({ isOpen }) => (
                                    <>
                                    <MenuButton isActive={isOpen} as={Button} rightIcon={<ChevronDownIcon />}>
                                        Select Station
                                    </MenuButton>
                                    <MenuList>
                                        {stationList.map((station, index) => (
                                            <MenuItem key={index}>{station.name + " (" + station.code + ")"}</MenuItem>
                                        ))}
                                    </MenuList>
                                    </>
                                )}
                            </Menu>

                            <Button ml={3} onClick={() => handleSubmitStation()} colorScheme='green'>
                                Submit
                            </Button>
                        </TabPanel>
                        <TabPanel>
                            {/* date picker and submit button */}
                            <Text>Coming soon!</Text>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </MotionBox>
        </MotionBox>
    );
};

export default Dashboard;