import styled from "styled-components/native";

export const Button = styled.TouchableOpacity`
    gap: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 20px;
    border-radius: 12px;
    background: ${({ theme }) => theme.secondary};
    font-size: 15px;
    margin-bottom: 15px;
`

export const ButtonTitle = styled.Text`
    color: ${({ theme }) => theme.primary};
    font-size: 15px;
    font-weight: bold;
`

export const Loading = styled.ActivityIndicator.attrs(({ theme }) => ({
    color: theme.primary,
    size: 'small'
}))``