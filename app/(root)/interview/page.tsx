import React from 'react'
import Agent from "@/components/Agent";

const Page = () => {
    return (
        <>
        <div>Interview Generation</div>
        <Agent userName="You"  userId="user1" type="generate" />
        </>
    )
}
export default Page
