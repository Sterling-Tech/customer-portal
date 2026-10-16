import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { VisitorAccessCodeResponse } from "@/app/services/accessCode";



interface Props {
    data: VisitorAccessCodeResponse;
    admitted?: boolean;
}

export default function AccessCodeResultCard({
    data,
    admitted = false,
}: Props) {

    return (

        <Card
            sx={{
                borderRadius: 3,
                mt: 3,
            }}
        >

            <CardContent>

                <Stack
                    direction="row"
                    sx={{spacing:1.5, alignItems:"center", mb:2}}

                >

                    <CheckCircleIcon
                        color="success"
                    />

                    <Box>

                        <Typography
                            sx={{fontWeight:700}}
                        >
                            {admitted
                                ? "Visitor Admitted"
                                : "Access Code Verified"}
                        </Typography>

                        <Typography
                            sx={{fontSize:13, color:"text.secondary"}}
                        >
                            {admitted
                                ? "The visitor has been admitted successfully."
                                : "The access code is valid."}
                        </Typography>

                    </Box>

                </Stack>


                <Divider sx={{ mb: 2 }} />


                <Stack spacing={2}>

                    <Box>

                        <Typography
                            sx={{fontSize:12, color:"text.secondary"}}
                        >
                            Access Code
                        </Typography>

                        <Chip
                            label={data.code}
                            sx={{
                                mt: 0.5,
                                fontWeight: 700,
                                letterSpacing: 1,
                            }}
                        />

                    </Box>


                    <Stack
                        direction="row"
                        sx={{spacing:1, alignItems:"center"}}
                    >

                        <PersonIcon
                            color="action"
                        />

                        <Box>

                            <Typography
                                sx={{fontSize:12, color:"text.secondary"}}
                            >
                                Visitor
                            </Typography>

                            <Typography
                                sx={{fontWeight:600}}
                            >
                                {
                                    data.visitor_name
                                }
                            </Typography>

                        </Box>

                    </Stack>


                    <Stack
                        direction="row"
                        sx={{spacing:1,alignItems:"center"}}
                    >

                        <PhoneIcon
                            color="action"
                        />

                        <Box>

                            <Typography
                                sx={{fontSize:12,color:"text.secondary"}}
                            >
                                Visitor Phone
                            </Typography>

                            <Typography
                                 sx={{fontSize:600}}
                            >
                                {
                                    data.visitor_phone
                                }
                            </Typography>

                        </Box>

                    </Stack>


                    <Stack
                        direction="row"
                        sx={{spacing:1, alignItems:"center"}}
                    >

                        <PersonIcon
                            color="action"
                        />

                        <Box>

                            <Typography
                                sx={{fontSize:12, color:"text.secondary"}}
                            >
                                Host
                            </Typography>

                            <Typography
                                sx={{fontWeight:600}}
                            >
                                {
                                    data.host.name
                                }
                            </Typography>

                            <Typography
                                sx={{fontSize:13, color:"text.secondary"}}
                            >
                                {
                                    data.host.phone_number
                                }
                            </Typography>

                        </Box>

                    </Stack>


                    <Stack
                        direction="row"
                        sx={{spacing:1, alignItems:"flex-start"}}
                    >

                        <LocationOnIcon
                            color="action"
                        />

                        <Box>

                            <Typography
                                sx={{fontSize:12, color:"text.secondary"}}
                            >
                                Host Address
                            </Typography>

                            <Typography>
                                {
                                    data.host.address
                                }
                            </Typography>

                        </Box>

                    </Stack>


                    <Stack
                        direction="row"
                        sx={{spacing:1, alignItems:"center"}}
                    >

                        <AccessTimeIcon
                            color="action"
                        />

                        <Box>

                            <Typography
                                sx={{fontSize:12, color:"text.secondary"}}
                            >
                                Expires
                            </Typography>

                            <Typography>
                                {new Date(
                                    data.expires_at
                                ).toLocaleString()}
                            </Typography>

                        </Box>

                    </Stack>


                    {admitted &&
                        data.used_at && (

                            <Stack
                                direction="row"
                                sx={{spacing:1, alignItems:"center"}}
                            >

                                <CheckCircleIcon
                                    color="success"
                                />

                                <Box>

                                    <Typography
                                        sx={{fontSize:12, color:"text.secondary"}}
                                    >
                                        Admitted At
                                    </Typography>

                                    <Typography>
                                        {new Date(
                                            data.used_at
                                        ).toLocaleString()}
                                    </Typography>

                                </Box>

                            </Stack>

                        )}

                </Stack>

            </CardContent>

        </Card>
    );
}