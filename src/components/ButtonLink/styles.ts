import styled from "styled-components/native";

export const Button = styled.TouchableOpacity`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 20px;
    border-radius: 12px;
    background: transparent;
    font-size: 15px;
`

export const ButtonTitle = styled.Text`
    color: ${({ theme }) => theme.tertiary};
    font-size: 15px;
    font-weight: bold;
`