"use client";

import { useState } from "react";
import { trpc } from "../_trpc/client";
import { serverClient } from "../_trpc/server";


export default function TodoList(
  {initialTodos}
  :{initialTodos :Awaited<ReturnType<(typeof serverClient)["getTodos"]>>}
  ) {

    const getTodos = trpc.getTodos.useQuery(undefined,{
      initialData:initialTodos,
      refetchOnMount:false,
      refetchOnReconnect:false,
    })
    const addTodo = trpc.addTodos.useMutation({
      onSettled: () =>{
        getTodos.refetch()
      }
    })
    const setDone = trpc.setDone.useMutation({
      onSettled: () =>{
        getTodos.refetch()
      }
    })
    const [content,setContent] = useState("")

  return (
    <div>
        <div>
          {getTodos?.data?.map((todo)=>(
          <div key={todo.id} className="flex gap-3 items-center">
            <input id={`check-${todo.id}`}
            type="checkbox" checked={!!todo.done}
            style={{zoom:1.5}}
            onChange={async() =>{
              setDone.mutate({
                id:todo.id,
                done:todo.done ? false : true
              })
            }}/>
            <label htmlFor={`check-${todo.id}`}>{todo.content}</label>
          </div>

        ))}
        </div>
        <div className="flex gap-3 items-center">
          <label htmlFor="cotent">Content</label>
          <input type="text" id="content" 
          value={content} onChange={(e) => setContent(e.target.value)}
          className="text-black flex-grow bg-white rounded-md border-gray-300 shadow-sm focus:text-blue-400"/>
          <button onClick={async () => {
            if(content.length){
              addTodo.mutate(content)
              setContent("")
            }
          }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-full">Add Todo</button>
        </div>
    </div>
  )
}
