import styled from "styled-components/native";

export const Input = styled.TextInput.attrs(({ theme }) => ({
    placeholderTextColor: theme.textAlt
}))`
    width: 100%;
    padding: 20px 16px;
    border-radius: 12px;
    background: ${({ theme }) => theme.backgroundAlt};
    color: ${({ theme }) => theme.text};
    font-size: 15px;
    margin-bottom: 10px;
`

export const Container = styled.View``

export const Icon = styled.TouchableOpacity`
    position: absolute;
    right: 15px;
    top:15px;
`