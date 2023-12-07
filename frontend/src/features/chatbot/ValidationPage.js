import { Box, Button, Paper, Slider, Stack, TextField, Typography } from "@mui/material";
import TabContainer from "../../components/tab/TabContainer";
import { useEffect, useRef, useState } from "react";
import OpenAI from "openai";

const chatbotAPI = async (chats) => {
    const openai = new OpenAI({
        apiKey: "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", // defaults to process.env["OPENAI_API_KEY"]
        dangerouslyAllowBrowser: true
    });

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system", 
                "content": "You are an expert panelist. You are going to evaluate the pitch. Your responses vary based on configured settings, ranging from leniency to harshness, generality to specificity, and optimism to pessimism. Explore different scenarios that illustrate how these configured settings impact your nuanced responses, considering the specified ranges from 0 to 1."
            },
            {
                "role": "system",
                "content": "Configure the panelist with a leniency setting of 0.5."
            },
            {
                "role": "system",
                "content": "Now, set the generality-to-specificity configuration to 0.3."
            },
            {
                "role": "system",
                "content": "Finally, adjust the optimism-to-pessimism setting to 0.8."
            },
            {
                "role": "system",
                "content": "Give comments and suggestions on the sent pitch."
            },
            ...chats
        ]
    });
    
    return completion.choices[0].message;
}

let ChatbotSetting = ({ slider, handleChange }) => {
    const valuetext = (value) => {
        return `${value}°C`;
    }
      
    return (
        <Box p={3} py={5}>
            <Stack spacing={5}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography sx={{ width: "150px" }} textAlign="end">General</Typography>
                    <Slider
                        aria-label="Temperature"
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        step={0.1}
                        marks
                        min={0}
                        max={1}
                        name="general_specific"
                        value={slider['general_specific']}
                        onChange={handleChange}
                    />
                    <Typography sx={{ width: "150px" }}>Specific</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography sx={{ width: "150px" }} textAlign="end">Lenient</Typography>
                    <Slider
                        aria-label="Temperature"
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        step={0.1}
                        marks
                        min={0}
                        max={1}
                        name="lenient_harsh"
                        value={slider['lenient_harsh']}
                        onChange={handleChange}
                    />
                    <Typography sx={{ width: "150px" }}>Harsh</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography sx={{ width: "150px" }} textAlign="end">Optimistic</Typography>
                    <Slider
                        aria-label="Temperature"
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        step={0.1}
                        marks
                        min={0}
                        max={1}
                        name="optimistic_pessimistic"
                        value={slider['optimistic_pessimistic']}
                        onChange={handleChange}
                    />
                    <Typography sx={{ width: "150px" }}>Pessimistic</Typography>
                </Stack>
            </Stack>
        </Box>
    );
}

let ChatbotCard = () => {
    const scrollableBoxRef = useRef(null);
    const [reScroll, setReScroll] = useState(false);

    const chat_data = localStorage.getItem("chatbot_chats") ? JSON.parse(localStorage.getItem("chatbot_chats")) : [];

    const [currentChat, setCurrentChat] = useState("");
    const [chats, setChats] = useState(chat_data);

    useEffect(() => {
        // Scroll to the bottom when the component mounts
        scrollableBoxRef.current.scrollTop = scrollableBoxRef.current.scrollHeight;
        if (reScroll) {
            setReScroll(false);
        }
    }, [reScroll]);

    const handleTextChange = (e) => {
        const { value } = e.target;
        setCurrentChat(value);
    }
    const handleSend = async () => {
        const newChats = [...chats, { role: "user", content: currentChat }];
        setChats(newChats);
        const message = await chatbotAPI(newChats);
        console.log(message);
        const newChatsWithAi = [...newChats, message];
        setChats(newChatsWithAi);
        setCurrentChat("");
        localStorage.setItem("chatbot_chats", JSON.stringify(newChatsWithAi));
    }

    return (
        <Box py={3}>
            <Paper sx={{ height: "calc(100vh - 64px - 48px - 48px - 48px - 1px)", p: 1, position: "relative" }}>
                <Box
                    ref={scrollableBoxRef}
                    sx={{ 
                        maxHeight: "calc(100vh - 64px - 48px - 48px - 48px - 16px - 72px - 1px)", 
                        px: 1,
                        overflowY: "hidden",
                        ":hover": {
                            overflowY: "auto",
                            scrollbarWidth: "thin",
                            "&::-webkit-scrollbar": {
                                width: "8px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: (theme) => theme.palette.primary.main,
                                borderRadius: "4px",
                            },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: (theme) => theme.palette.background.paper,
                            },
                        },
                    }}
                >
                    <Stack spacing={2}>
                        {chats.map((chat, index) => (
                            <Paper key={index} sx={{ backgroundColor: "black", width: "30%", p: 2, marginLeft: chat.role === "user" ? "auto !important" : "" }}>
                                <Stack spacing={1}>
                                    <Typography variant="body1" fontSize={14}>{chat.role === "user" ? "You" : "Expert Panelist"}</Typography>
                                    <Typography variant="body1" fontSize={14}>{chat.content}</Typography>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                </Box>
                <Paper sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", p: 2}}>
                    <Stack direction="row" spacing={1}>
                        <TextField value={currentChat} onChange={handleTextChange} fullWidth size="small" label="Write your pitch..." />
                        <Button onClick={handleSend} size="small" variant="contained">Send</Button>
                    </Stack>
                </Paper>
            </Paper>
        </Box>
    );
}

function ValidationPage(props) {
    const tabOptions = [
        { value: 0, name: "Validation"},
        { value: 1, name: "Settings" },
    ];

    const [tabValue, setTabValue] = useState(0);
    const [slider, setSlider] = useState({
        general_specific: localStorage.getItem("general_specific") ? localStorage.getItem("general_specific") : 0.5,
        lenient_harsh: localStorage.getItem("lenient_harsh") ? localStorage.getItem("lenient_harsh") : 0.5,
        optimistic_pessimistic: localStorage.getItem("optimistic_pessimistic") ? localStorage.getItem("optimistic_pessimistic") : 0.5
    });

    const handleSliderChange = (e) => {
        const { name, value } = e.target;
        setSlider((previous) => ({
            ...previous,
            [name]: value
        }));
        localStorage.setItem(name, value);
    }

    const handleTabChange = (event, value) => {
        // const option = tabOptions.find((option) => option.value === value);
        setTabValue(value);
    }

    return (
        <Box p={3}>
            <TabContainer 
                tabOptions={tabOptions}
                handleChange={handleTabChange}
                selected={tabValue}
            />
            {tabValue === 0 && <ChatbotCard /> }
            {tabValue === 1 && <ChatbotSetting slider={slider} handleChange={handleSliderChange} /> }
        </Box>
    );
}

export default ValidationPage;
