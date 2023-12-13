import { prismaClient } from "@/db/db";
import { publicProcedure, router } from "./trpc";
import z from "zod"

export const appRouter = router({
    getTodos : publicProcedure.query(async () =>{
        return await prismaClient.todos.findMany();
    }),
   addTodos: publicProcedure.input(z.string()).mutation(async (opts) =>{
    await prismaClient.todos.create({
        data:{
            content: opts.input,
            done:false
        }
    })
    return true
   }),
   setDone: publicProcedure
    .input(z.object({
        id:z.string(),
        done:z.boolean()
   }))
   .mutation(async(opts) =>{
        await prismaClient.todos.update({
            where:{
                id:opts.input.id
            },
            data:{
                done:opts.input.done
            }
        })
        return true
   })

})

export type AppRouter = typeof appRouter